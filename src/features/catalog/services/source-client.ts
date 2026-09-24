import { z } from 'zod';

import {
  metadataInput,
  platforms,
  sourceInput,
} from '@/features/catalog/schemas/catalog-input';

import type {
  CatalogSnapshot,
  CatalogVersion,
  Provider,
} from '@/features/catalog/schemas/catalog-input';

export class SourceError extends Error {
  constructor(
    message: string,
    public status = 0,
    public retryAfter = 0,
  ) {
    super(message);
  }
}
const strings = z.array(z.string());
const date = z.string().datetime({ offset: true });
const mrProject = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  team: z.string(),
  versions: strings,
  loaders: strings,
  categories: strings,
  icon_url: z.string().nullable(),
  issues_url: z.string().nullable(),
  source_url: z.string().nullable(),
  wiki_url: z.string().nullable(),
});
const mrVersion = z.object({
  id: z.string(),
  project_id: z.string(),
  name: z.string(),
  version_number: z.string().max(150).optional(),
  version_type: z.string(),
  date_published: date,
  loaders: strings,
  game_versions: strings,
  status: z.string(),
  dependencies: z.array(
    z.object({
      project_id: z.string().nullable(),
      version_id: z.string().nullable(),
      file_name: z.string().nullable(),
      dependency_type: z.string(),
    }),
  ),
});
const hgProject = z.object({
  id: z.number().int(),
  name: z.string(),
  namespace: z.object({ owner: z.string(), slug: z.string() }),
  description: z.string(),
  visibility: z.string(),
  category: z.string(),
  avatarUrl: z.string().nullable(),
  supportedPlatforms: z.record(strings),
  settings: z.object({
    links: z.array(
      z.object({
        links: z.array(z.object({ name: z.string(), url: z.string() })),
      }),
    ),
    unlisted: z.boolean(),
  }),
});
const hgVersion = z.object({
  id: z.number().int(),
  projectId: z.number().int(),
  name: z.string(),
  createdAt: date,
  visibility: z.string(),
  channel: z.object({ name: z.string() }),
  platformDependencies: z.record(strings),
  pluginDependencies: z.record(
    z.array(
      z.object({
        name: z.string(),
        projectId: z.number().nullable(),
        required: z.boolean(),
        platform: z.string(),
      }),
    ),
  ),
});
const accepted = (values: string[]) => [
  ...new Set(
    values
      .map((v) => v.toLowerCase())
      .filter((v): v is (typeof platforms)[number] =>
        (platforms as readonly string[]).includes(v),
      ),
  ),
];
const links = (values: { label: string; url: string | null }[]) =>
  values
    .filter(
      (v): v is { label: string; url: string } =>
        !!v.url && /^https:\/\//i.test(v.url),
    )
    .slice(0, 30);

export function createSourceClient(
  fetcher: typeof fetch = fetch,
  pause: (ms: number) => Promise<void> = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms)),
) {
  async function json(
    provider: Exclude<Provider, 'manual'>,
    path: string,
  ): Promise<unknown> {
    const origin =
      provider === 'modrinth' ?
        'https://api.modrinth.com/v2'
      : 'https://hangar.papermc.io/api/v1';
    await pause(300); // stay below Hangar's default rate, even during pagination
    let response: Response;
    try {
      response = await fetcher(`${origin}${path}`, {
        headers: {
          'User-Agent':
            'Minecentral-Official/Minecentral-Dashboard (https://www.minecentral.net)',
          Accept: 'application/json',
        },
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new SourceError('Source request failed or timed out.');
    }
    if (!response.ok) {
      const raw =
        response.headers.get('retry-after') ??
        response.headers.get('x-ratelimit-reset') ??
        '';
      const seconds =
        /^\d+$/.test(raw) ?
          Number(raw)
        : Math.max(0, (Date.parse(raw) - Date.now()) / 1000);
      throw new SourceError(
        `Source HTTP ${response.status}`,
        response.status,
        Number.isFinite(seconds) ? Math.min(Math.max(seconds, 0), 86400) : 0,
      );
    }
    // Bound decompressed bytes rather than trusting Content-Length.
    const reader = response.body?.getReader();
    if (!reader) throw new SourceError('Empty source response.');
    let size = 0;
    const chunks: Uint8Array[] = [];
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 10_000_000) {
          await reader.cancel();
          throw new SourceError('Source response exceeds import limit.');
        }
        chunks.push(value);
      }
    } catch (error) {
      if (error instanceof SourceError) throw error;
      throw new SourceError('Source response interrupted.');
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new SourceError('Source returned invalid JSON.');
    }
  }
  return {
    async snapshot(
      provider: Exclude<Provider, 'manual'>,
      locator: string,
    ): Promise<CatalogSnapshot> {
      sourceInput.parse({ provider, locator });
      if (provider === 'modrinth') {
        const p = mrProject.parse(
          await json(provider, `/project/${encodeURIComponent(locator)}`),
        );
        if (!['approved', 'archived'].includes(p.status))
          throw new SourceError('Source project is not publicly listed.', 404);
        const supported = accepted(p.loaders);
        if (!supported.length)
          throw new SourceError('No server plugin platforms reported.', 422);
        if (p.versions.length > 5000)
          throw new SourceError(
            'Project exceeds the 5000-version import limit.',
            422,
          );
        const team = z
          .array(z.object({ user: z.object({ username: z.string() }) }))
          .parse(
            await json(provider, `/team/${encodeURIComponent(p.team)}/members`),
          );
        const versions: CatalogVersion[] = [];
        for (let i = 0; i < p.versions.length; i += 100) {
          const ids = p.versions.slice(i, i + 100);
          const batch = z
            .array(mrVersion)
            .parse(
              await json(
                provider,
                `/versions?ids=${encodeURIComponent(JSON.stringify(ids))}`,
              ),
            );
          if (batch.some((v) => v.project_id !== p.id || !ids.includes(v.id)))
            throw new SourceError('Source returned unrelated versions.', 422);
          for (const v of batch) {
            const loaders = accepted(v.loaders);
            if (!loaders.length || !['listed', 'archived'].includes(v.status))
              continue;
            versions.push({
              externalId: v.id,
              name: v.name,
              versionNumber: v.version_number ?? null,
              channel: v.version_type,
              publishedAt: v.date_published,
              url: `https://modrinth.com/plugin/${p.slug}/version/${v.id}`,
              support: loaders.map((platform) => ({
                platform,
                versions: v.game_versions,
                kind: 'minecraft',
              })),
              dependencies: v.dependencies.map((d) => ({
                sourceProjectId: d.project_id,
                sourceVersionId: d.version_id,
                name: d.file_name,
                type: d.dependency_type,
                platform: null,
              })),
            });
          }
        }
        return {
          provider,
          externalId: p.id,
          locator: p.id,
          url: `https://modrinth.com/plugin/${p.slug}`,
          metadata: metadataInput.parse({
            name: p.title,
            description: p.description,
            authors: team.map((v) => v.user.username),
            categories: p.categories,
            platforms: supported,
            icon: p.icon_url,
            links: links([
              { label: 'Source code', url: p.source_url },
              { label: 'Documentation', url: p.wiki_url },
              { label: 'Issues', url: p.issues_url },
            ]),
          }),
          versions,
        };
      }
      const path = locator.split('/').map(encodeURIComponent).join('/');
      const p = hgProject.parse(await json(provider, `/projects/${path}`));
      if (p.visibility !== 'public' || p.settings.unlisted)
        throw new SourceError('Source project is not publicly listed.', 404);
      const supported = accepted(Object.keys(p.supportedPlatforms));
      if (!supported.length)
        throw new SourceError('No supported plugin platforms reported.', 422);
      const url = `https://hangar.papermc.io/${encodeURIComponent(p.namespace.owner)}/${encodeURIComponent(p.namespace.slug)}`;
      const versions: CatalogVersion[] = [];
      for (let offset = 0; offset < 5000; offset += 25) {
        const batch = z
          .object({
            pagination: z.object({ count: z.number().int().nonnegative() }),
            result: z.array(hgVersion),
          })
          .parse(
            await json(
              provider,
              `/projects/${p.id}/versions?limit=25&offset=${offset}`,
            ),
          );
        if (batch.pagination.count > 5000)
          throw new SourceError(
            'Project exceeds the 5000-version import limit.',
            422,
          );
        if (batch.result.some((v) => v.projectId !== p.id))
          throw new SourceError('Source returned unrelated versions.', 422);
        for (const v of batch.result) {
          if (v.visibility !== 'public') continue;
          versions.push({
            externalId: String(v.id),
            name: v.name,
            versionNumber: v.name,
            channel: v.channel.name,
            publishedAt: v.createdAt,
            url: `${url}/versions/${encodeURIComponent(v.name)}`,
            support: Object.entries(v.platformDependencies)
              .filter(([platform]) => accepted([platform]).length)
              .map(([platform, versions]) => ({
                platform: platform.toLowerCase(),
                versions,
                kind: platform === 'PAPER' ? 'minecraft' : 'platform',
              })),
            dependencies: Object.entries(v.pluginDependencies).flatMap(
              ([platform, values]) =>
                values.map((d) => ({
                  sourceProjectId:
                    d.projectId === null ? null : String(d.projectId),
                  sourceVersionId: null,
                  name: d.name,
                  type: d.required ? 'required' : 'optional',
                  platform: platform.toLowerCase(),
                })),
            ),
          });
        }
        if (offset + batch.result.length >= batch.pagination.count) break;
        if (!batch.result.length)
          throw new SourceError(
            'Source pagination ended before its reported count.',
          );
      }
      return {
        provider,
        externalId: String(p.id),
        locator: String(p.id),
        url,
        metadata: metadataInput.parse({
          name: p.name,
          description: p.description,
          authors: [p.namespace.owner],
          categories: [p.category],
          platforms: supported,
          icon: p.avatarUrl,
          links: links(
            p.settings.links.flatMap((g) =>
              g.links.map((l) => ({ label: l.name, url: l.url })),
            ),
          ),
        }),
        versions,
      };
    },
  };
}
