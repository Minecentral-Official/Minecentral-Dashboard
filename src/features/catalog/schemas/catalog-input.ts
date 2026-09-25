import { z } from 'zod';

export const providers = ['modrinth', 'hangar', 'manual'] as const;
export type Provider = (typeof providers)[number];
export const platforms = [
  'paper',
  'folia',
  'purpur',
  'spigot',
  'bukkit',
  'velocity',
  'waterfall',
  'bungeecord',
  'sponge',
] as const;
export const safeUrl = z
  .string()
  .url()
  .max(2048)
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  }, 'Use an HTTPS URL without credentials.');
export const metadataInput = z.object({
  name: z.string().trim().min(1).max(150),
  description: z.string().max(2000),
  authors: z.array(z.string().max(150)).max(100),
  categories: z.array(z.string().max(80)).max(50),
  platforms: z.array(z.enum(platforms)).max(20),
  links: z
    .array(z.object({ label: z.string().max(100), url: safeUrl }))
    .max(30),
  icon: safeUrl.nullable(),
});
export type CatalogMetadata = z.infer<typeof metadataInput>;
export type CatalogSupport = {
  platform: string;
  versions: string[];
  kind: 'minecraft' | 'platform';
};
export type CatalogDependency = {
  sourceProjectId: string | null;
  sourceVersionId: string | null;
  name: string | null;
  type: string;
  platform: string | null;
};
export type CatalogVersion = {
  externalId: string;
  name: string;
  channel: string;
  publishedAt: string;
  url: string;
  support: CatalogSupport[];
  dependencies: CatalogDependency[];
};
export type CatalogSnapshot = {
  provider: Exclude<Provider, 'manual'>;
  externalId: string;
  locator: string;
  url: string;
  metadata: CatalogMetadata;
  versions: CatalogVersion[];
};
export const sourceInput = z.object({
  provider: z.enum(['modrinth', 'hangar']),
  locator: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?$/),
});
export const manualInput = metadataInput.extend({
  url: safeUrl,
  reason: z.string().trim().min(10).max(2000),
});
export const mergeInput = z
  .object({
    from: z.string().uuid(),
    into: z.string().uuid(),
    reason: z.string().trim().min(10).max(2000),
  })
  .refine((v) => v.from !== v.into, 'Choose different projects.');
export function catalogHref(project: { id: string; slug: string }) {
  return `/discover/plugins/${project.id}/${project.slug}`;
}
export function parseCatalogFilters(
  params: Record<string, string | string[] | undefined>,
) {
  const one = (key: string) =>
    typeof params[key] === 'string' ? (params[key] as string) : '';
  const many = (key: string) =>
    [
      ...new Set(
        (Array.isArray(params[key]) ? params[key] : [params[key]]).filter(
          (v): v is string =>
            typeof v === 'string' && /^[a-zA-Z0-9_.-]{1,80}$/.test(v),
        ),
      ),
    ].slice(0, 10);
  const page = Number(one('page'));
  return {
    q: one('q').trim().slice(0, 150),
    category: many('category'),
    platform: many('platform').filter((v) =>
      (platforms as readonly string[]).includes(v),
    ),
    gameVersion: many('gameVersion'),
    source: many('source').filter((v) =>
      (providers as readonly string[]).includes(v),
    ),
    sort: one('sort') === 'updated' ? ('updated' as const) : ('name' as const),
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
    limit:
      [12, 24, 48].includes(Number(one('limit'))) ? Number(one('limit')) : 24,
  };
}
