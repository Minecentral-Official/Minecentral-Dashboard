import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { connection } from 'next/server';

import { catalogService } from '@/features/catalog/queries/catalog-access';
import { catalogHref } from '@/features/catalog/schemas/catalog-input';

export const instant = false;
export default async function CatalogDetail({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { projectId, slug } = await params;
  const query = await searchParams;
  const result = await catalogService.detail(
    projectId,
    Number(query.page ?? 1),
  );
  if (!result) notFound();
  if (result.redirect) permanentRedirect(catalogHref(result.redirect));
  const { project, sources, versions } = result;
  if (slug !== project.slug) permanentRedirect(catalogHref(project));
  return (
    <main className='space-y-9'>
      <Link href='/discover/plugins' className='text-sm text-muted-foreground'>
        ← Plugin catalog
      </Link>
      <header>
        <p className='font-mono text-xs uppercase tracking-widest text-primary'>
          {project.metadata.platforms.join(' / ') || 'Platform unknown'}
        </p>
        <h1 className='my-3 break-words text-4xl font-semibold'>
          {project.name}
        </h1>
        <p className='max-w-3xl text-lg text-muted-foreground'>
          {project.description}
        </p>
        <p className='mt-3 text-sm'>
          By {project.metadata.authors.join(', ') || 'unknown author'}
        </p>
      </header>
      <nav
        aria-label='Plugin sections'
        className='flex flex-wrap gap-5 border-b pb-4'
      >
        {['Overview', 'Versions', 'Sources', 'Compatibility', 'Configs'].map(
          (s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className='text-sm underline underline-offset-4'
            >
              {s}
            </a>
          ),
        )}
      </nav>
      <section id='overview'>
        <h2 className='text-xl font-semibold'>Overview</h2>
        <p className='mt-3 text-muted-foreground'>
          Categories: {project.metadata.categories.join(', ') || 'Not recorded'}
          . Downloads and publisher documentation stay with their original
          sources.
        </p>
        <ul className='mt-3 flex flex-wrap gap-4'>
          {project.metadata.links.map((link, i) => (
            <li key={i}>
              <a
                href={link.url}
                rel='noreferrer'
                className='text-primary underline'
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section id='sources'>
        <h2 className='text-xl font-semibold'>Sources and freshness</h2>
        <div className='mt-4 divide-y border-y'>
          {sources.map((s) => (
            <article
              key={s.id}
              className='grid gap-3 py-5 sm:grid-cols-[10rem_1fr]'
            >
              <p className='font-mono text-sm uppercase'>{s.provider}</p>
              <div>
                <a
                  href={s.url}
                  rel='noreferrer'
                  className='break-all text-primary underline'
                >
                  View on{' '}
                  {s.provider === 'manual' ? 'publisher website' : s.provider}{' '}
                  ↗
                </a>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {s.status === 'manual' ?
                    'Manually curated · external links only. Versions and support are not verified.'
                  : s.status === 'unavailable' ?
                    'Source unavailable. Previous metadata is retained for attribution.'
                  : `${s.status === 'error' ? 'Refresh failed · showing last known metadata. ' : ''}Last successful sync: ${s.lastSyncedAt?.toISOString().slice(0, 16).replace('T', ' ') ?? 'Never'} UTC`
                  }
                </p>
                {Object.keys(project.curated).length > 0 && (
                  <p className='mt-2 text-xs text-muted-foreground'>
                    MineCentral curation may override the displayed overview.
                    Publisher metadata remains attributed to this source.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id='versions'>
        <h2 className='text-xl font-semibold'>Versions and declared support</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          These declarations come from each source. Dependencies are reported
          requirements, not resolved or tested compatibility.
        </p>
        {versions.length ?
          <div className='mt-5 divide-y border-y'>
            {versions.map(({ version: v, provider }) => (
              <article key={v.id} className='space-y-3 py-5'>
                <div className='flex flex-wrap justify-between gap-3'>
                  <h3 className='break-all font-semibold'>{v.name}</h3>
                  <span className='font-mono text-xs text-muted-foreground'>
                    {provider} · {v.channel} ·{' '}
                    {v.publishedAt.toISOString().slice(0, 10)}
                  </span>
                </div>
                {v.support.map((s) => (
                  <p key={s.platform} className='break-words text-sm'>
                    <span className='font-medium capitalize'>{s.platform}</span>{' '}
                    {s.kind === 'minecraft' ? 'Minecraft' : 'platform'}{' '}
                    versions:{' '}
                    <span className='text-muted-foreground'>
                      {s.versions.join(', ') || 'Unknown'}
                    </span>
                  </p>
                ))}
                <details className='text-sm'>
                  <summary className='cursor-pointer'>
                    Declared dependencies ({v.dependencies.length})
                  </summary>
                  {v.dependencies.length ?
                    <ul className='mt-2 space-y-1'>
                      {v.dependencies.map((d, i) => (
                        <li key={i}>
                          {d.name ??
                            d.sourceProjectId ??
                            d.sourceVersionId ??
                            'Unresolved dependency'}{' '}
                          · {d.type}
                          {d.platform ? ` · ${d.platform}` : ''}
                        </li>
                      ))}
                    </ul>
                  : <p className='mt-2 text-muted-foreground'>
                      None reported by this source. This does not prove the
                      plugin has no dependencies.
                    </p>
                  }
                </details>
                <a
                  href={v.url}
                  rel='noreferrer'
                  className='inline-block text-sm text-primary underline'
                >
                  Release details and downloads ↗
                </a>
              </article>
            ))}
          </div>
        : <p className='mt-4 rounded-lg border border-dashed p-5 text-muted-foreground'>
            No synced versions available. Follow the publisher link for release
            information; support remains unknown.
          </p>
        }
        <nav aria-label='Version pages' className='mt-4 flex justify-between'>
          {result.page > 1 ?
            <Link
              href={`${catalogHref(project)}?page=${result.page - 1}#versions`}
            >
              ← Newer versions
            </Link>
          : <span />}
          {result.hasNext && (
            <Link
              href={`${catalogHref(project)}?page=${result.page + 1}#versions`}
            >
              Older versions →
            </Link>
          )}
        </nav>
      </section>
      <div className='grid gap-5 sm:grid-cols-2'>
        <section
          id='compatibility'
          className='rounded-lg border border-dashed p-5'
        >
          <h2 className='font-semibold'>Compatibility</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Not checked. Stack-specific dependency and compatibility analysis is
            coming in a later epic.
          </p>
        </section>
        <section id='configs' className='rounded-lg border border-dashed p-5'>
          <h2 className='font-semibold'>Configs</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Configuration guides and reusable configs are not available yet. Use
            the publisher documentation above.
          </p>
        </section>
      </div>
    </main>
  );
}
