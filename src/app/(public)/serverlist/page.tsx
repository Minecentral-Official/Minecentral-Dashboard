import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { C_ServerCategories } from '@/features/serverlist/config/c-server-categories.config';
import { C_ServerLoaders } from '@/features/serverlist/config/c-server-loaders.config';
import { ServerCard } from '@/features/serverlist/components/ui/server-card';
import serverListAllFiltered from '@/features/serverlist/queries/server-list-all-filter.get';
import { S_ServerListFilter } from '@/features/serverlist/schemas/zod/s-server-list-filter.zod';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildUrl(
  current: Record<string, string | undefined>,
  next: Record<string, string | null>,
  resetPage = true,
) {
  const params = new URLSearchParams();
  Object.entries({ ...current, ...next }).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (resetPage) params.delete('p');
  const query = params.toString();
  return query ? `/serverlist?${query}` : '/serverlist';
}

function toggleCsv(value: string | undefined, item: string) {
  const values = value ? value.split(',').filter(Boolean) : [];
  const next =
    values.includes(item) ?
      values.filter((value) => value !== item)
    : [...values, item];
  return next.length > 0 ? next.join(',') : null;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const raw = {
    q: firstParam(params.q),
    category: firstParam(params.category),
    platform: firstParam(params.platform),
    sort: firstParam(params.sort),
    p: firstParam(params.p),
    limit: firstParam(params.limit),
  };
  const filters = S_ServerListFilter.parse({
    query: raw.q,
    categories: raw.category,
    platforms: raw.platform,
    sort: raw.sort,
    page: raw.p,
    limit: raw.limit,
  });
  const result = await serverListAllFiltered(filters);
  const current = {
    q: raw.q,
    category: raw.category,
    platform: raw.platform,
    sort: raw.sort,
    limit: raw.limit,
  };

  return (
    <main className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-3xl font-semibold'>Minecraft Servers</h1>
          <p className='text-sm text-muted-foreground'>
            Browse public servers by game mode, platform, and vote activity.
          </p>
        </div>
        <Button asChild>
          <Link href='/dashboard/servers'>Create listing</Link>
        </Button>
      </div>

      <form className='grid gap-3 md:grid-cols-[1fr_auto_auto]'>
        <div>
          <Label htmlFor='q'>Search</Label>
          <Input
            id='q'
            name='q'
            defaultValue={filters.query}
            placeholder='Search servers...'
          />
        </div>
        <div>
          <Label>Sort</Label>
          <Select name='sort' defaultValue={filters.sort}>
            <SelectTrigger className='min-w-44'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='updated'>Recently updated</SelectItem>
              <SelectItem value='top'>Top voted</SelectItem>
              <SelectItem value='newest'>Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-end'>
          <Button>Apply</Button>
        </div>
        {raw.category && <input type='hidden' name='category' value={raw.category} />}
        {raw.platform && <input type='hidden' name='platform' value={raw.platform} />}
      </form>

      <div className='grid gap-6 lg:grid-cols-[220px_1fr]'>
        <aside className='flex flex-col gap-5'>
          <div className='space-y-2'>
            <h2 className='text-sm font-semibold'>Game modes</h2>
            <div className='flex flex-wrap gap-2 lg:flex-col'>
              {C_ServerCategories.map((category) => {
                const active = filters.categories?.includes(category);
                return (
                  <Button
                    key={category}
                    variant={active ? 'default' : 'outline'}
                    size='sm'
                    asChild
                  >
                    <Link
                      href={buildUrl(current, {
                        category: toggleCsv(raw.category, category),
                      })}
                    >
                      {category}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
          <div className='space-y-2'>
            <h2 className='text-sm font-semibold'>Platform</h2>
            <div className='flex flex-wrap gap-2 lg:flex-col'>
              {C_ServerLoaders.map((platform) => {
                const active = filters.platforms?.includes(platform);
                return (
                  <Button
                    key={platform}
                    variant={active ? 'default' : 'outline'}
                    size='sm'
                    asChild
                  >
                    <Link
                      href={buildUrl(current, {
                        platform: toggleCsv(raw.platform, platform),
                      })}
                    >
                      {platform}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <p className='text-sm text-muted-foreground'>
              {result.totalCount} servers found
            </p>
            {(raw.category || raw.platform || raw.q || raw.sort) && (
              <Button variant='outline' size='sm' asChild>
                <Link href='/serverlist'>Clear filters</Link>
              </Button>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            {filters.categories?.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
            {filters.platforms?.map((platform) => (
              <Badge key={platform}>{platform}</Badge>
            ))}
          </div>
          {result.servers.length > 0 ?
            <div className='flex flex-col gap-3'>
              {result.servers.map((server) => (
                <ServerCard key={server.id} {...server} />
              ))}
            </div>
          : <div className='rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground'>
              No servers match those filters.
            </div>}
          {result.totalPages > 1 && (
            <div className='flex justify-center gap-2'>
              {filters.page > 1 && (
                <Button variant='outline' asChild>
                  <Link
                    href={buildUrl(
                      current,
                      { p: String(filters.page - 1) },
                      false,
                    )}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              <span className='flex items-center text-sm text-muted-foreground'>
                Page {filters.page} of {result.totalPages}
              </span>
              {filters.page < result.totalPages && (
                <Button variant='outline' asChild>
                  <Link
                    href={buildUrl(
                      current,
                      { p: String(filters.page + 1) },
                      false,
                    )}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
