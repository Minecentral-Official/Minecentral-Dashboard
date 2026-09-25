import type {
  CompatibilityEntry,
  CompatibilityReport,
  CompatibilitySnapshot,
  CompatibilityState,
  DependencyFinding,
  EvidenceClaim,
} from '@/features/workspaces/schemas/compatibility-types';

export const COMPATIBILITY_ENGINE_VERSION = '1';
export const SOURCE_MAX_AGE_MS = 30 * 86400000;
export const COMMUNITY_MAX_AGE_MS = 90 * 86400000;
const order = (a: string, b: string) =>
  a < b ? -1
  : a > b ? 1
  : 0;

// Deliberately bounded numeric releases, not guessed semver from display names.
// Unsupported syntax, prereleases and missing version numbers remain unknown.
export function matchesVersionRange(
  version: string | null,
  range: string | null,
): boolean | null {
  if (!version || !range) return null;
  const numeric = (s: string) =>
    /^\d{1,9}(?:\.\d{1,9}){1,3}$/.test(s) ? s.split('.').map(Number) : null;
  const installed = numeric(version);
  if (!installed) return null;
  const terms = range.trim().split(/\s+/);
  if (!terms.length || terms.length > 8) return null;
  let matches = true;
  for (const term of terms) {
    const parsed = /^(>=|<=|>|<|=)?(\d+(?:\.\d+){1,3})$/.exec(term);
    const target = parsed ? numeric(parsed[2]) : null;
    if (!parsed || !target) return null;
    let comparison = 0;
    for (let i = 0; i < Math.max(installed.length, target.length); i++) {
      if ((installed[i] ?? 0) !== (target[i] ?? 0)) {
        comparison = (installed[i] ?? 0) > (target[i] ?? 0) ? 1 : -1;
        break;
      }
    }
    matches &&=
      parsed[1] === '>=' ? comparison >= 0
      : parsed[1] === '<=' ? comparison <= 0
      : parsed[1] === '>' ? comparison > 0
      : parsed[1] === '<' ? comparison < 0
      : comparison === 0;
  }
  return matches;
}

export function sourceClaim(
  entry: CompatibilityEntry,
  target: { platform: string; minecraftVersion: string },
  now: Date,
): EvidenceClaim | null {
  if (!entry.versionId || !entry.sourceUrl || !entry.sourceSyncedAt)
    return null;
  const matching = entry.support.filter(
    (s) => s.platform === target.platform && s.kind === 'minecraft',
  );
  const result =
    matching.some((s) => s.versions.includes(target.minecraftVersion)) ?
      'compatible'
    : matching.length && matching.every((s) => s.versions.length > 0) ?
      'incompatible'
    : 'unknown';
  const expiresAt = new Date(
    new Date(entry.sourceSyncedAt).getTime() + SOURCE_MAX_AGE_MS,
  ).toISOString();
  const eligible =
    entry.available &&
    entry.sourceStatus !== 'unavailable' &&
    new Date(entry.sourceSyncedAt) <= now &&
    new Date(expiresAt) > now;
  return {
    id: `source:${entry.versionId}`,
    kind: 'source-metadata',
    result,
    confidence: 'medium',
    provenance: `${entry.provider} release declarations`,
    url: entry.sourceUrl,
    observedAt: entry.sourceSyncedAt,
    expiresAt,
    eligible,
    detail:
      !eligible ?
        'Release withdrawn, source unavailable, or declaration older than 30 days; excluded from the current result.'
      : result === 'compatible' ?
        'The publisher lists this platform and Minecraft version. This is a declaration, not a runtime test.'
      : result === 'incompatible' ?
        'The target Minecraft version is outside the publisher’s declared versions for this platform.'
      : 'No exact platform/game declaration is available. Platform inheritance and proxy version equivalence are not assumed.',
  };
}

function runtimeState(claims: EvidenceClaim[]): CompatibilityState {
  const current = claims.filter((e) => e.eligible && e.confidence !== 'low');
  const yes = current.some((e) => e.result === 'compatible');
  const no = current.some((e) => e.result === 'incompatible');
  return (
    yes && no ? 'conflicting-evidence'
    : yes ? 'compatible'
    : no ? 'incompatible'
    : 'unknown'
  );
}

// Iterative strongly connected components: no recursive traversal or cycle overflow.
function findCycles(ids: string[], findings: DependencyFinding[]): string[][] {
  const graph = new Map(ids.map((id) => [id, [] as string[]]));
  const reverse = new Map(ids.map((id) => [id, [] as string[]]));
  for (const edge of findings) {
    if (
      !['required', 'optional'].includes(edge.kind) ||
      !edge.targetEntryId ||
      !graph.has(edge.fromEntryId) ||
      !graph.has(edge.targetEntryId)
    )
      continue;
    graph.get(edge.fromEntryId)!.push(edge.targetEntryId);
    reverse.get(edge.targetEntryId)!.push(edge.fromEntryId);
  }
  for (const edges of [...graph.values(), ...reverse.values()])
    edges.sort(order);
  const seen = new Set<string>();
  const finished: string[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const stack: [string, number][] = [[id, 0]];
    seen.add(id);
    while (stack.length) {
      const top = stack[stack.length - 1];
      const edges = graph.get(top[0])!;
      if (top[1] < edges.length) {
        const next = edges[top[1]++];
        if (!seen.has(next)) {
          seen.add(next);
          stack.push([next, 0]);
        }
      } else {
        finished.push(top[0]);
        stack.pop();
      }
    }
  }
  seen.clear();
  const groups: string[][] = [];
  for (const id of finished.reverse()) {
    if (seen.has(id)) continue;
    const stack = [id];
    const group: string[] = [];
    seen.add(id);
    while (stack.length) {
      const node = stack.pop()!;
      group.push(node);
      for (const next of reverse.get(node)!)
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
    }
    if (group.length > 1 || graph.get(id)!.includes(id))
      groups.push(group.sort(order));
  }
  return groups.sort((a, b) => order(a.join(','), b.join(',')));
}

export function resolveCompatibility(
  snapshot: CompatibilitySnapshot,
  now = new Date(),
): CompatibilityReport {
  const entries = [...snapshot.entries].sort((a, b) => order(a.id, b.id));
  const active = new Map(
    entries.filter((e) => e.enabled).map((e) => [e.projectId, e]),
  );
  const findings: DependencyFinding[] = [];
  const output = entries.map((entry) => {
    const source = sourceClaim(entry, snapshot, now);
    const evidence = [...entry.evidence, ...(source ? [source] : [])]
      .map((e) => ({
        ...e,
        eligible:
          e.eligible &&
          new Date(e.expiresAt) > now &&
          new Date(e.observedAt) <= now,
      }))
      .sort((a, b) => order(a.id, b.id));
    const state =
      entry.enabled && entry.versionId ? runtimeState(evidence) : 'unknown';
    return {
      id: entry.id,
      projectId: entry.projectId,
      name: entry.name,
      enabled: entry.enabled,
      versionName: entry.versionName,
      state,
      evidence,
      reason:
        !entry.enabled ?
          'Disabled: excluded from dependency and runtime checks.'
        : !entry.versionId ?
          'Select an exact catalog release to evaluate runtime evidence. Manual and unknown versions are not guessed.'
        : state === 'compatible' ?
          'Current evidence supports this runtime. Check dependency warnings separately; this is not a guarantee for the whole server.'
        : state === 'incompatible' ?
          'Current evidence reports this runtime as unsupported.'
        : state === 'conflicting-evidence' ?
          'Current supporting and opposing evidence disagree. Neither has silently overridden the other.'
        : 'There is not enough current, eligible evidence for this exact release and runtime.',
    };
  });
  const graphFindingIds = new Set<string>();
  function dependency(
    from: CompatibilityEntry,
    data: {
      id: string;
      kind: DependencyFinding['kind'];
      targetProjectId: string | null;
      name: string;
      exactVersion: string | null;
      versionRange: string | null;
      provenance: string;
      url: string | null;
      suggestedUrl: string | null;
      observedAt: string;
      eligible: boolean;
      identityUnknown?: boolean;
    },
  ) {
    const target =
      data.targetProjectId ? active.get(data.targetProjectId) : undefined;
    const disabled =
      data.targetProjectId ?
        entries.find((e) => e.projectId === data.targetProjectId)
      : undefined;
    if (data.eligible && target && ['required', 'optional'].includes(data.kind))
      graphFindingIds.add(data.id);
    let state: DependencyFinding['state'] = 'unknown';
    let reason: string;
    if (!data.eligible)
      reason =
        'The relationship is stale, withdrawn or cannot be scoped to this installed version. Review its evidence before acting.';
    else if (data.kind === 'embedded') {
      state = 'satisfied';
      reason =
        'The publisher marks this dependency as bundled; no separate stack entry is required.';
    } else if (data.kind === 'unknown')
      reason =
        'The source reports an unrecognized dependency type. No hard requirement is inferred.';
    else if (!data.targetProjectId || data.identityUnknown)
      reason =
        'The source identity or exact required release is not mapped in the catalog. Ask a curator to resolve it; names alone are not a match.';
    else if (!target) {
      state =
        data.kind === 'required' ? 'missing'
        : data.kind === 'optional' ? 'optional-missing'
        : 'satisfied';
      reason =
        data.kind === 'required' ?
          `${disabled ? 'Disabled' : 'Missing'} required plugin: ${data.name}.`
        : data.kind === 'optional' ?
          `Optional plugin ${data.name} is ${disabled ? 'disabled' : 'not recorded'}; this does not block the stack.`
        : 'The other plugin is not enabled, so this relationship is not active.';
    } else {
      const match =
        data.exactVersion ?
          target.versionId ?
            target.versionId === data.exactVersion
          : null
        : data.versionRange ?
          matchesVersionRange(target.versionNumber, data.versionRange)
        : undefined;
      if (data.kind === 'conflict' || data.kind === 'overlap') {
        state =
          match === null ? 'unknown'
          : match === false ? 'satisfied'
          : data.kind;
        reason =
          state === 'unknown' ?
            'The installed version cannot be compared to the scope of this relationship.'
          : state === 'satisfied' ?
            'The recorded version is outside this relationship’s scope.'
          : data.kind === 'conflict' ?
            `Known conflict with ${target.name}; review the linked evidence and disable or change one plugin.`
          : `Functionality overlaps with ${target.name}. This is informational, not an incompatibility claim.`;
      } else {
        state =
          match === false ? 'incompatible'
          : match === null ? 'unknown'
          : 'satisfied';
        reason =
          match === false ?
            `${target.name} is outside the required ${data.exactVersion ? 'exact catalog release' : `version range ${data.versionRange}`}.`
          : match === null ?
            `${target.name} is present, but its version or the constraint syntax is unknown; no mismatch is asserted.`
          : `${target.name} is present${match === undefined ? '; no version constraint was reported, so version suitability remains unknown' : ' and meets the recorded version constraint'}.`;
      }
    }
    findings.push({
      id: data.id,
      fromEntryId: from.id,
      targetProjectId: data.targetProjectId,
      targetEntryId: target?.id ?? disabled?.id ?? null,
      targetName: target?.name ?? data.name,
      kind: data.kind,
      state,
      reason,
      provenance: data.provenance,
      url: data.url,
      observedAt: data.observedAt,
      requiredVersionId: data.exactVersion,
      suggestedUrl: data.suggestedUrl,
    });
  }
  for (const entry of entries.filter((e) => e.enabled)) {
    const declared = sourceClaim(entry, snapshot, now);
    const deps = [...entry.dependencies].sort((a, b) =>
      order(JSON.stringify(a), JSON.stringify(b)),
    );
    if (!entry.versionId || !declared?.eligible) {
      findings.push({
        id: `metadata:${entry.id}`,
        fromEntryId: entry.id,
        targetProjectId: null,
        targetEntryId: null,
        targetName: 'Dependency metadata',
        kind: 'unknown',
        state: 'unknown',
        reason:
          'Current dependency metadata is unavailable for this selected release. Missing metadata does not mean no dependencies.',
        provenance: entry.provider ?? 'User-recorded version',
        url: entry.sourceUrl,
        observedAt: entry.sourceSyncedAt ?? now.toISOString(),
        requiredVersionId: null,
        suggestedUrl: null,
      });
    }
    for (const [i, dep] of deps.entries()) {
      if (dep.platform && dep.platform !== snapshot.platform) continue;
      const p =
        dep.sourceProjectId ?
          snapshot.projects.find(
            (p) =>
              p.provider === entry.provider &&
              p.externalId === dep.sourceProjectId,
          )
        : undefined;
      const versionMatches =
        dep.sourceVersionId ?
          snapshot.versions.filter(
            (v) =>
              v.provider === entry.provider &&
              v.externalId === dep.sourceVersionId &&
              (!p || v.projectId === p.projectId),
          )
        : [];
      const v = versionMatches.length === 1 ? versionMatches[0] : undefined;
      const kind =
        dep.type === 'required' ? 'required'
        : dep.type === 'optional' ? 'optional'
        : dep.type === 'incompatible' ? 'conflict'
        : dep.type === 'embedded' ? 'embedded'
        : 'unknown';
      dependency(entry, {
        id: `source:${entry.id}:${i}`,
        kind,
        targetProjectId: p?.projectId ?? v?.projectId ?? null,
        name:
          p?.name ??
          v?.name ??
          dep.name ??
          dep.sourceProjectId ??
          'Unresolved dependency',
        exactVersion: v?.versionId ?? null,
        versionRange: null,
        provenance: `${entry.provider} dependency declaration`,
        url: entry.sourceUrl,
        suggestedUrl: v?.url ?? p?.url ?? null,
        observedAt: entry.sourceSyncedAt ?? now.toISOString(),
        eligible: !!declared?.eligible,
        identityUnknown:
          (!!dep.sourceVersionId && !v) ||
          (!!p && !!v && p.projectId !== v.projectId),
      });
    }
    for (const relation of [...snapshot.relationships].sort((a, b) =>
      order(a.id, b.id),
    )) {
      if (
        relation.fromProjectId !== entry.projectId ||
        (relation.platform && relation.platform !== snapshot.platform) ||
        (relation.minecraftVersion &&
          relation.minecraftVersion !== snapshot.minecraftVersion)
      )
        continue;
      if (
        relation.fromVersionId &&
        entry.versionId &&
        relation.fromVersionId !== entry.versionId
      )
        continue;
      const targetProject = snapshot.projects.find(
        (p) => p.projectId === relation.toProjectId,
      );
      dependency(entry, {
        id: `curated:${entry.id}:${relation.id}`,
        kind: relation.kind,
        targetProjectId: relation.toProjectId,
        name: targetProject?.name ?? 'Catalog plugin',
        exactVersion: relation.toVersionId,
        versionRange: relation.versionRange,
        provenance: relation.provenance,
        url: relation.url,
        suggestedUrl:
          snapshot.versions.find((v) => v.versionId === relation.toVersionId)
            ?.url ??
          targetProject?.url ??
          null,
        observedAt: relation.observedAt,
        eligible:
          new Date(relation.expiresAt) > now &&
          new Date(relation.observedAt) <= now &&
          (!relation.fromVersionId || !!entry.versionId),
      });
    }
  }
  findings.sort((a, b) => order(a.id, b.id));
  const cycles = findCycles(
    entries.filter((e) => e.enabled).map((e) => e.id),
    findings.filter((f) => graphFindingIds.has(f.id)),
  );
  return {
    engineVersion: COMPATIBILITY_ENGINE_VERSION,
    platform: snapshot.platform,
    minecraftVersion: snapshot.minecraftVersion,
    computedAt: now.toISOString(),
    entries: output,
    findings,
    cycles,
    summary: {
      compatible: output.filter((e) => e.enabled && e.state === 'compatible')
        .length,
      incompatible: output.filter(
        (e) => e.enabled && e.state === 'incompatible',
      ).length,
      unknown: output.filter((e) => e.enabled && e.state === 'unknown').length,
      conflicting: output.filter(
        (e) => e.enabled && e.state === 'conflicting-evidence',
      ).length,
      blocked: findings.filter(
        (f) =>
          f.state === 'conflict' ||
          (f.kind === 'required' &&
            (f.state === 'missing' || f.state === 'incompatible')),
      ).length,
    },
  };
}
