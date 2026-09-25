import {
  isAlias,
  isCollection,
  isMap,
  isNode,
  isPair,
  isScalar,
  LineCounter,
  parseDocument,
} from 'yaml';

import { CONFIG_MAX_BYTES } from '@/features/workspaces/schemas/config-input';

import type {
  ConfigDiagnostic,
  ConfigProfile,
} from '@/features/workspaces/schemas/config-input';

const coreTags = new Set(
  ['map', 'seq', 'str', 'null', 'bool', 'int', 'float'].map(
    (s) => `tag:yaml.org,2002:${s}`,
  ),
);
export function inspectConfig(
  content: string,
  profile: ConfigProfile = 'syntax',
) {
  const diagnostics: ConfigDiagnostic[] = [];
  const error = (
    message: string,
    category: ConfigDiagnostic['category'] = 'syntax',
    position?: { line: number; col: number },
  ) =>
    diagnostics.push({
      severity: 'error',
      category,
      message,
      line: position?.line,
      column: position?.col,
    });
  if (new TextEncoder().encode(content).length > CONFIG_MAX_BYTES) {
    error('Configuration exceeds the 128 KiB limit.', 'limit');
    return { valid: false, diagnostics };
  }
  if (!content.trim()) {
    error('Enter a YAML configuration before saving.');
    return { valid: false, diagnostics };
  }
  if (content.includes('\0')) {
    error('Binary content is not a YAML configuration.');
    return { valid: false, diagnostics };
  }
  const lines = new LineCounter();
  try {
    const doc = parseDocument(content, {
      version: '1.2',
      schema: 'core',
      customTags: [],
      resolveKnownTags: false,
      uniqueKeys: true,
      stringKeys: true,
      prettyErrors: false,
      lineCounter: lines,
    });
    for (const e of doc.errors)
      error(e.message, 'syntax', lines.linePos(e.pos[0]));
    for (const w of doc.warnings)
      error(w.message, 'syntax', lines.linePos(w.pos[0]));
    if (doc.directives.yaml.version !== '1.2')
      error('Use YAML 1.2; legacy YAML directives are not supported.');
    if (doc.errors.length)
      return { valid: false, diagnostics: diagnostics.slice(0, 20) };
    const pending: { node: unknown; depth: number }[] = [
      { node: doc.contents, depth: 0 },
    ];
    let nodes = 0;
    while (pending.length) {
      const { node, depth } = pending.pop()!;
      if (++nodes > 10000 || depth > 64) {
        error(
          'Configuration exceeds the nesting or node limit (64 levels / 10,000 nodes).',
          'limit',
        );
        break;
      }
      if (isAlias(node))
        error(
          'YAML aliases are not supported. Replace the alias with explicit values.',
          'syntax',
          node.range ? lines.linePos(node.range[0]) : undefined,
        );
      if (isNode(node) && node.tag && !coreTags.has(node.tag))
        error(
          'Custom YAML tags are not supported.',
          'syntax',
          node.range ? lines.linePos(node.range[0]) : undefined,
        );
      if (isPair(node))
        pending.push(
          { node: node.key, depth },
          { node: node.value, depth: depth + 1 },
        );
      else if (isCollection(node))
        for (const child of node.items)
          pending.push({ node: child, depth: depth + 1 });
    }
    if (!isMap(doc.contents))
      error('The configuration must be a YAML mapping of settings.');
    if (!diagnostics.length && profile === 'bukkit-basic') {
      const settings = doc.getIn(['settings'], true);
      const warn = (message: string, node: unknown) => {
        const pos =
          isNode(node) && node.range ? lines.linePos(node.range[0]) : undefined;
        diagnostics.push({
          severity: 'warning',
          category: 'schema',
          message,
          line: pos?.line,
          column: pos?.col,
        });
      };
      if (settings !== undefined && !isMap(settings))
        warn('Bukkit settings should be a mapping.', settings);
      else
        for (const [key, type] of [
          ['allow-end', 'boolean'],
          ['connection-throttle', 'number'],
          ['shutdown-message', 'string'],
        ] as const) {
          const node = doc.getIn(['settings', key], true);
          if (
            node !== undefined &&
            (!isScalar(node) ||
              typeof node.value !== type ||
              (type === 'number' && !Number.isFinite(node.value)))
          )
            warn(`settings.${key} should be a ${type}.`, node);
        }
    }
  } catch {
    error(
      'YAML could not be parsed safely. Reduce nesting and check the syntax.',
    );
  }
  return {
    valid: !diagnostics.some((d) => d.severity === 'error'),
    diagnostics: diagnostics.slice(0, 20),
  };
}

// Raw editing is deliberately lossless: validate, then export the exact saved text.
export function serializeConfig(
  content: string,
  profile: ConfigProfile = 'syntax',
) {
  const result = inspectConfig(content, profile);
  if (!result.valid) throw new ConfigValidationError(result.diagnostics);
  return content;
}
export class ConfigValidationError extends Error {
  constructor(public readonly diagnostics: ConfigDiagnostic[]) {
    super('Fix the YAML errors before saving or exporting.');
  }
}
