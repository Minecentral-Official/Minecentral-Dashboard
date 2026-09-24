import Link from 'next/link';
import { connection } from 'next/server';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { catalogService } from '@/features/catalog/queries/catalog-access';
import {
  catalogHref,
  platforms,
  providers,
} from '@/features/catalog/schemas/catalog-input';
import { featureFlags } from '@/lib/env/feature-flags';

export const instant = false;
export const metadata = {
  title: 'Plugin catalog',
  alternates: { canonical: '/discover/plugins' },
};
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const params = await searchParams;
  const result = await catalogService.search(params);
  const f = result.filters;
  const pageUrl = (page: number) => {
    const q = new URLSearchParams();
    if (f.q) q.set('q', f.q);
    for (const key of [
      'category',
      'platform',
      'gameVersion',
      'source',
    ] as const)
      for (const value of f[key]) q.append(key, value);
    if (f.sort !== 'name') q.set('sort', f.sort);
    if (f.limit !== 24) q.set('limit', String(f.limit));
    if (page > 1) q.set('page', String(page));
    return `/discover/plugins?${q}`;
  };
  const selectClass =
    'mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm';
  return (
    <main>
      <p className='font-mono text-xs uppercase tracking-widest text-primary'>
        Find the pieces for your server
      </p>
      <h1 className='mt-3 text-4xl font-semibold tracking-tight'>
        Plugin catalog
      </h1>
      <p className='mt-4 max-w-2xl text-muted-foreground'>
        Compare source-reported platforms and releases. A listed version is
        evidence from its publisher—not a compatibility check for your stack.
      </p>
      <form
        action='/discover/plugins'
        className='my-8 space-y-4 rounded-lg border bg-card p-5'
      >
        <div>
          <label htmlFor='catalog-q' className='text-sm'>
            Name or description
          </label>
          <Input
            id='catalog-q'
            name='q'
            defaultValue={f.q}
            maxLength={150}
            placeholder='Search plugin names and descriptions'
            className='mt-2'
          />
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          <label className='text-sm'>
            Platform
            <select
              name='platform'
              defaultValue={f.platform[0] ?? ''}
              className={selectClass}
            >
              <option value=''>All platforms</option>
              {platforms.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className='text-sm'>
            Minecraft version
            <Input
              name='gameVersion'
              defaultValue={f.gameVersion[0] ?? ''}
              placeholder='e.g. 1.21.11'
              maxLength={80}
              className='mt-2'
            />
          </label>
          <label className='text-sm'>
            Category
            <Input
              name='category'
              defaultValue={f.category[0] ?? ''}
              placeholder='e.g. utility'
              maxLength={80}
              className='mt-2'
            />
          </label>
          <label className='text-sm'>
            Source
            <select
              name='source'
              defaultValue={f.source[0] ?? ''}
              className={selectClass}
            >
              <option value=''>All sources</option>
              {providers.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className='text-sm'>
            Sort
            <select name='sort' defaultValue={f.sort} className={selectClass}>
              <option value='name'>Name</option>
              <option value='updated'>Recently refreshed</option>
            </select>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <Button type='submit'>Search catalog</Button>
          <Link href='/discover/plugins' className='text-sm underline'>
            Clear filters
          </Link>
        </div>
      </form>
      <div className='mb-3 flex justify-between gap-3 text-sm text-muted-foreground'>
        <p>Source-attributed projects</p>
        <p>Page {f.page}</p>
      </div>
      {result.projects.length ?
        <ul className='divide-y border-y'>
          {result.projects.map((p) => (
            <li key={p.id}>
              <Link
                href={catalogHref(p)}
                className='group grid gap-4 rounded-sm py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:grid-cols-[1fr_12rem]'
              >
                <div>
                  <h2 className='text-xl font-semibold group-hover:text-primary'>
                    {p.name} <span aria-hidden='true'>↗</span>
                  </h2>
                  <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground'>
                    {p.description}
                  </p>
                  <p className='mt-3 text-xs text-muted-foreground'>
                    {p.metadata.authors.length ?
                      `By ${p.metadata.authors.join(', ')}`
                    : 'Author not recorded'}
                  </p>
                </div>
                <div className='border-l-2 border-primary/70 pl-4 font-mono text-xs'>
                  <p className='uppercase'>
                    {p.metadata.platforms.join(' / ') || 'Platform unknown'}
                  </p>
                  <p className='mt-3 text-muted-foreground'>
                    {p.metadata.categories.join(' · ') || 'Uncategorized'}
                  </p>
                  <p className='mt-3 text-muted-foreground'>
                    Compatibility not checked
                  </p>
                </div>
              </Link>
              {featureFlags.workspaces && (
                <Link
                  href={`/servers/add-plugin?projectId=${p.id}`}
                  className='mb-5 inline-block text-sm text-primary underline'
                >
                  Add to a workspace<span className='sr-only'> {p.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      : <section className='rounded-lg border border-dashed px-6 py-12'>
          <h2 className='text-xl font-semibold'>No matching plugins</h2>
          <p className='mt-3 text-muted-foreground'>
            Try fewer filters or a different search. Projects appear here after
            a curator adds them and their metadata sync finishes.
          </p>
          <Link
            href='/discover/plugins'
            className='mt-5 inline-block text-primary underline'
          >
            Browse all plugins
          </Link>
        </section>
      }
      <nav aria-label='Catalog pages' className='mt-6 flex justify-between'>
        {f.page > 1 ?
          <Link href={pageUrl(f.page - 1)}>← Previous</Link>
        : <span />}
        {result.hasNext && <Link href={pageUrl(f.page + 1)}>Next →</Link>}
      </nav>
    </main>
  );
}
