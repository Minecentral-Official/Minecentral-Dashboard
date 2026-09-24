import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { recomputeCompatibilityAction } from '@/features/workspaces/actions/compatibility.actions';
import CompatibilityStateBadge, {
  compatibilityLabels,
} from '@/features/workspaces/components/compatibility-state';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { compatibilityService } from '@/features/workspaces/queries/compatibility-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

import type {
  CompatibilityState,
  DependencyFinding,
} from '@/features/workspaces/schemas/compatibility-types';

export const instant = false;
const groups: { title: string; match: (f: DependencyFinding) => boolean }[] = [
  {
    title: 'Action required',
    match: (f) =>
      f.state === 'conflict' ||
      (f.kind === 'required' && ['missing', 'incompatible'].includes(f.state)),
  },
  { title: 'Needs evidence', match: (f) => f.state === 'unknown' },
  {
    title: 'Informational',
    match: (f) =>
      f.state === 'overlap' ||
      (f.kind === 'optional' &&
        ['optional-missing', 'incompatible'].includes(f.state)),
  },
];
export default async function CompatibilityPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  const result = await compatibilityService.report(
    await workspaceActor(),
    workspaceId,
  );
  const query = await searchParams;
  const base = `/servers/${workspaceId}`;
  const report = result.report;
  const state =
    (
      typeof query.state === 'string' &&
      Object.hasOwn(compatibilityLabels, query.state)
    ) ?
      (query.state as CompatibilityState)
    : '';
  const filtered =
    report?.entries.filter((e) => !state || e.state === state) ?? [];
  const requestedPage = Number(query.page);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ?
      Math.min(requestedPage, Math.max(1, Math.ceil(filtered.length / 24)))
    : 1;
  const selected = filtered.slice((page - 1) * 24, page * 24);
  const findingPageValue = Number(query.findingPage);
  const actionable =
    report?.findings
      .filter((f) => f.state !== 'satisfied')
      .sort(
        (a, b) =>
          groups.findIndex((g) => g.match(a)) -
          groups.findIndex((g) => g.match(b)),
      ) ?? [];
  const findingPage =
    Number.isSafeInteger(findingPageValue) && findingPageValue > 0 ?
      Math.min(findingPageValue, Math.max(1, Math.ceil(actionable.length / 24)))
    : 1;
  const visibleFindings = actionable.slice(
    (findingPage - 1) * 24,
    findingPage * 24,
  );
  const url = (p: number, fp = findingPage) =>
    `${base}/compatibility?${new URLSearchParams({ state, page: String(p), findingPage: String(fp) })}`;
  return (
    <div className='space-y-7'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='font-mono text-xs uppercase tracking-widest text-primary'>
            {workspace.platform} / {workspace.minecraftVersion}
          </p>
          <h2 className='mt-2 text-3xl font-semibold'>Compatibility</h2>
          <p className='mt-3 max-w-2xl text-sm text-muted-foreground'>
            Evidence for your recorded releases, followed by dependency checks.
            Supported runtime evidence is not a guarantee that the whole server
            will work.
          </p>
        </div>
        {canUseWorkspace(workspace.role, 'content') && (
          <WorkspaceActionForm
            action={recomputeCompatibilityAction.bind(null, workspaceId)}
            label='Recheck compatibility'
          />
        )}
      </header>
      {result.error ?
        <section
          role='alert'
          className='rounded-lg border border-destructive/50 p-5'
        >
          <h3 className='font-semibold'>Report unavailable</h3>
          <p className='mt-2'>{result.error}</p>
        </section>
      : report && (
          <>
            <p className='font-mono text-xs text-muted-foreground'>
              Checked {report.computedAt.slice(0, 16).replace('T', ' ')} UTC
            </p>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              {[
                [
                  'Needs action',
                  report.summary.incompatible + report.summary.blocked,
                ],
                ['Evidence disagrees', report.summary.conflicting],
                ['Runtime unknown', report.summary.unknown],
                ['Runtime supported', report.summary.compatible],
              ].map(([label, value]) => (
                <div key={label} className='rounded-lg border p-4'>
                  <p className='text-sm text-muted-foreground'>{label}</p>
                  <p className='mt-2 font-mono text-xl'>{value}</p>
                </div>
              ))}
            </div>
            {!report.entries.length ?
              <section className='rounded-lg border border-dashed p-6'>
                <h3 className='text-xl font-semibold'>
                  Record plugins to check compatibility
                </h3>
                <p className='my-3 text-sm text-muted-foreground'>
                  An empty stack is not proof of compatibility. Add plugins and
                  select their installed releases first.
                </p>
                <Link
                  href={`${base}/stack/add`}
                  className='text-primary underline'
                >
                  Add a plugin
                </Link>
              </section>
            : <>
                <section
                  className='space-y-5'
                  aria-label='Dependency and conflict findings'
                >
                  <h3 className='text-xl font-semibold'>
                    Dependencies and conflicts
                  </h3>
                  {!actionable.length && (
                    <p className='text-sm text-muted-foreground'>
                      No actionable dependency conflicts found in current
                      metadata. Unreported requirements may still exist.
                    </p>
                  )}
                  {groups.map((group) => {
                    const rows = visibleFindings.filter(group.match);
                    return rows.length ?
                        <div key={group.title}>
                          <h4
                            className={`mb-3 text-sm font-semibold ${
                              group.title === 'Action required' ?
                                'text-destructive'
                              : group.title === 'Needs evidence' ?
                                'text-muted-foreground'
                              : 'text-primary'
                            }`}
                          >
                            {group.title}
                          </h4>
                          <ul className='divide-y rounded-lg border px-4'>
                            {rows.map((f) => (
                              <li key={f.id} className='space-y-2 py-4'>
                                <p className='font-medium'>
                                  {
                                    report.entries.find(
                                      (e) => e.id === f.fromEntryId,
                                    )?.name
                                  }{' '}
                                  → {f.targetName}
                                </p>
                                <p className='text-sm'>{f.reason}</p>
                                <p className='text-xs text-muted-foreground'>
                                  {f.kind} · {f.provenance} ·{' '}
                                  {f.observedAt.slice(0, 10)}
                                </p>
                                <div className='flex flex-wrap gap-4 text-sm'>
                                  {f.targetEntryId ?
                                    <Link
                                      href={`${base}/stack/${f.targetEntryId}`}
                                      className='text-primary underline'
                                    >
                                      Review installed dependency
                                    </Link>
                                  : f.targetProjectId ?
                                    <Link
                                      href={`${base}/stack/add?projectId=${f.targetProjectId}`}
                                      className='text-primary underline'
                                    >
                                      Add dependency
                                    </Link>
                                  : <Link
                                      href={`${base}/stack/${f.fromEntryId}`}
                                      className='text-primary underline'
                                    >
                                      Review plugin version
                                    </Link>
                                  }
                                  {f.url && (
                                    <a
                                      href={f.url}
                                      rel='noreferrer'
                                      className='underline'
                                    >
                                      Relationship evidence ↗
                                    </a>
                                  )}
                                  {f.suggestedUrl && (
                                    <a
                                      href={f.suggestedUrl}
                                      rel='noreferrer'
                                      className='underline'
                                    >
                                      {f.requiredVersionId ?
                                        'Required release'
                                      : 'Dependency project'}{' '}
                                      ↗
                                    </a>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      : null;
                  })}
                  {actionable.length > 24 && (
                    <nav
                      className='flex justify-between text-sm'
                      aria-label='Finding pages'
                    >
                      {findingPage > 1 ?
                        <Link href={url(page, findingPage - 1)}>
                          ← Previous findings
                        </Link>
                      : <span />}
                      <span>Findings page {findingPage}</span>
                      {findingPage * 24 < actionable.length && (
                        <Link href={url(page, findingPage + 1)}>
                          More findings →
                        </Link>
                      )}
                    </nav>
                  )}
                </section>
                {report.cycles.length > 0 && (
                  <section className='rounded-lg border border-amber-600/40 p-5'>
                    <h3 className='font-semibold'>Dependency cycles</h3>
                    <p className='mt-2 text-sm'>
                      These plugins form dependency loops. Review their
                      load-order guidance; a cycle alone is not an
                      incompatibility verdict.
                    </p>
                    <ul className='mt-3 space-y-2 text-sm'>
                      {report.cycles.slice(0, 24).map((cycle) => (
                        <li key={cycle.join(',')}>
                          {cycle
                            .map(
                              (id) =>
                                report.entries.find((e) => e.id === id)?.name ??
                                id,
                            )
                            .join(' ↔ ')}
                        </li>
                      ))}
                    </ul>
                    {report.cycles.length > 24 && (
                      <p className='mt-2 text-sm'>
                        {report.cycles.length} cycles total; showing the first
                        24.
                      </p>
                    )}
                  </section>
                )}
                <section className='space-y-4'>
                  <h3 className='text-xl font-semibold'>
                    Runtime evidence by plugin
                  </h3>
                  <form className='flex flex-wrap items-end gap-3'>
                    <label className='text-sm'>
                      Evidence state
                      <select
                        name='state'
                        defaultValue={state}
                        className='mt-2 block rounded-md border bg-background p-2'
                      >
                        <option value=''>All states</option>
                        {Object.entries(compatibilityLabels).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                    <Button variant='outline'>Filter evidence</Button>
                  </form>
                  {!selected.length && (
                    <p>
                      No entries match this evidence state.{' '}
                      <Link
                        href={`${base}/compatibility`}
                        className='underline'
                      >
                        Clear filter
                      </Link>
                    </p>
                  )}
                  <ul className='divide-y border-y'>
                    {selected.map((e) => (
                      <li key={e.id} className='space-y-3 py-5'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                          <div>
                            <h4 className='text-lg font-semibold'>{e.name}</h4>
                            <p className='mt-1 font-mono text-xs text-muted-foreground'>
                              {e.versionName ?? 'Version unknown'} ·{' '}
                              {e.enabled ? 'Enabled' : 'Disabled'}
                            </p>
                          </div>
                          <CompatibilityStateBadge state={e.state} />
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {e.reason}
                        </p>
                        <Link
                          href={`${base}/stack/${e.id}`}
                          className='inline-block text-sm text-primary underline'
                        >
                          Change version or record a test
                        </Link>
                        <details>
                          <summary className='cursor-pointer text-sm'>
                            Evidence ({e.evidence.length})
                          </summary>
                          <ul className='mt-3 space-y-3'>
                            {e.evidence.map((c) => (
                              <li
                                key={c.id}
                                className='rounded-md bg-muted/40 p-3 text-sm'
                              >
                                <p className='font-medium'>
                                  {c.kind} · {c.result} · {c.confidence}{' '}
                                  confidence
                                </p>
                                <p className='mt-1'>{c.provenance}</p>
                                <p className='mt-1 text-muted-foreground'>
                                  {c.detail}
                                </p>
                                <p className='mt-2 font-mono text-xs'>
                                  Observed {c.observedAt.slice(0, 10)} · expires{' '}
                                  {c.expiresAt.slice(0, 10)} ·{' '}
                                  {c.eligible && c.confidence !== 'low' ?
                                    'Included'
                                  : 'Excluded from verdict'}
                                </p>
                                {c.url && (
                                  <a
                                    href={c.url}
                                    rel='noreferrer'
                                    className='mt-2 inline-block underline'
                                  >
                                    View evidence source ↗
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                          {!e.evidence.length && (
                            <p className='mt-2 text-sm text-muted-foreground'>
                              No evidence has been recorded for this exact
                              release and runtime.
                            </p>
                          )}
                        </details>
                      </li>
                    ))}
                  </ul>
                  <nav
                    className='flex justify-between text-sm'
                    aria-label='Evidence pages'
                  >
                    {page > 1 ?
                      <Link href={url(page - 1)}>← Previous plugins</Link>
                    : <span />}
                    <span>
                      {filtered.length} entries · Page {page}
                    </span>
                    {page * 24 < filtered.length && (
                      <Link href={url(page + 1)}>More plugins →</Link>
                    )}
                  </nav>
                </section>
              </>
            }
          </>
        )
      }
      <Link href='/servers/reports' className='inline-block text-sm underline'>
        Manage my community test reports
      </Link>
    </div>
  );
}
