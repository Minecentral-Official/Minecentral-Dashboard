import Link from 'next/link';

import CatalogForm from '@/features/catalog/components/catalog-form';
import { catalogService } from '@/features/catalog/queries/catalog-access';
import requirePermission from '@/lib/auth/helpers/require-permission';

export const instant = false;
export default async function Sources() {
  const { user } = await requirePermission('catalog:curate');
  const { jobs, sources } = await catalogService.operations(user.id);
  return (
    <main className='mx-auto max-w-4xl space-y-8 p-4'>
      <h1 className='text-3xl font-semibold'>Sources and sync jobs</h1>
      <Link href='/admin/catalog' className='text-primary underline'>
        Catalog curation →
      </Link>
      <p className='text-muted-foreground'>
        Jobs run in the catalog worker, outside page requests. Temporary
        failures retry with backoff; after five attempts use a new request to
        retry.
      </p>
      <section>
        <h2 className='text-xl font-semibold'>Recent jobs</h2>
        <ul className='mt-4 divide-y'>
          {jobs.map((j) => (
            <li key={j.id} className='space-y-2 py-4'>
              <p className='break-all font-medium'>
                {j.provider} / {j.locator}
              </p>
              <p className='font-mono text-xs'>
                {j.status} · attempt {j.attempts} · next{' '}
                {j.nextAttemptAt.toISOString()}
              </p>
              {j.error && (
                <p className='text-sm text-muted-foreground'>{j.error}</p>
              )}
              {['failed', 'done'].includes(j.status) && (
                <CatalogForm operation='sync' label='Queue another sync'>
                  <input type='hidden' name='provider' value={j.provider} />
                  <input type='hidden' name='locator' value={j.locator} />
                </CatalogForm>
              )}
            </li>
          ))}
        </ul>
        {!jobs.length && (
          <p className='mt-4 text-muted-foreground'>
            No jobs yet. Queue a project from Catalog curation.
          </p>
        )}
      </section>
      <section>
        <h2 className='text-xl font-semibold'>Tracked sources</h2>
        <ul className='mt-4 divide-y'>
          {sources.map((s) => (
            <li key={s.id} className='space-y-2 py-4'>
              <a
                href={s.url}
                rel='noreferrer'
                className='break-all text-primary underline'
              >
                {s.provider} / {s.externalId}
              </a>
              <p className='font-mono text-xs'>
                {s.status} · last success{' '}
                {s.lastSyncedAt?.toISOString() ?? 'not synced'} · failures{' '}
                {s.failures}
              </p>
              {s.error && (
                <p className='text-sm text-muted-foreground'>{s.error}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
