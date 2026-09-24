import { z } from 'zod';

export const stackId = z.string().uuid();
export const versionInput = z.discriminatedUnion('versionSource', [
  z.object({ versionSource: z.literal('unknown') }),
  z.object({
    versionSource: z.literal('manual'),
    manualVersion: z.string().trim().min(1).max(150),
  }),
  z.object({ versionSource: z.literal('catalog'), versionId: stackId }),
]);
export const stackMetadataInput = z.object({
  alias: z.string().trim().max(150),
  notes: z.string().max(10000),
  enabled: z.boolean(),
});
const importItem = z
  .object({
    project: z.string().trim().min(1).max(2048),
    version: z.string().trim().min(1).max(150).optional(),
  })
  .strict();
export function parseStackImport(text: string) {
  const value = z.string().trim().min(1).max(50000).parse(text);
  if (value.startsWith('{') || value.startsWith('[')) {
    return z
      .object({ plugins: z.array(importItem).min(1).max(100) })
      .strict()
      .parse(JSON.parse(value)).plugins;
  }
  return z
    .array(importItem)
    .min(1)
    .max(100)
    .parse(
      value
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((project) => ({ project })),
    );
}
export function declaredSupport(
  support: { platform: string; kind: string; versions: string[] }[],
  runtime: { platform: string; minecraftVersion: string },
): 'declared' | 'unsupported' | 'unknown' {
  if (!support.length) return 'unknown';
  const platform = support.filter(
    (s) => s.platform === runtime.platform && s.kind === 'minecraft',
  );
  if (!platform.length) return 'unsupported';
  if (platform.some((s) => s.versions.includes(runtime.minecraftVersion)))
    return 'declared';
  return platform.every((s) => !s.versions.length) ? 'unknown' : 'unsupported';
}
export type ImportPreview = {
  project: string;
  version?: string;
  candidates: { id: string; name: string }[];
  status: 'matched' | 'ambiguous' | 'unresolved';
};
export type ImportResult = {
  project: string;
  status: 'added' | 'skipped' | 'unresolved';
};
