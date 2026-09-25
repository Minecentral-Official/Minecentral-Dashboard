import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CatalogForm from '@/features/catalog/components/catalog-form';
import { catalogService } from '@/features/catalog/queries/catalog-access';
import { catalogHref } from '@/features/catalog/schemas/catalog-input';
import requirePermission from '@/lib/auth/helpers/require-permission';

export const instant = false;
export default async function AdminCatalog() {
  await requirePermission('catalog:curate');
  const { projects } = await catalogService.search({
    sort: 'updated',
    limit: '48',
  });
  return (
    <main className='mx-auto max-w-4xl space-y-8 p-4'>
      <h1 className='text-3xl font-semibold'>Catalog curation</h1>
      <p className='text-muted-foreground'>
        Queue imports, add publisher links, and review identities. Names alone
        are never enough evidence to merge projects.
      </p>
      <Link
        href='/admin/sources'
        className='inline-block text-primary underline'
      >
        Sync jobs and source freshness →
      </Link>
      <Link
        href='/admin/compatibility'
        className='inline-block text-primary underline'
      >
        Compatibility evidence and community reviews →
      </Link>
      <Link
        href='/admin/config-schemas'
        className='inline-block text-primary underline'
      >
        Visual config schemas →
      </Link>
      <section className='space-y-4 rounded-lg border p-5'>
        <h2 className='text-xl font-semibold'>Import a project</h2>
        <CatalogForm operation='sync' label='Queue metadata sync'>
          <label className='block text-sm'>
            Source
            <select
              name='provider'
              className='mt-2 block w-full rounded-md border bg-background p-2'
            >
              <option value='modrinth'>Modrinth</option>
              <option value='hangar'>Hangar</option>
            </select>
          </label>
          <label className='block text-sm'>
            Project ID or slug
            <Input
              name='locator'
              required
              maxLength={160}
              placeholder='Modrinth ID/slug or Hangar owner/slug'
            />
          </label>
          <p className='text-xs text-muted-foreground'>
            Metadata only. The background worker fetches public API data; no
            plugin files are downloaded.
          </p>
        </CatalogForm>
      </section>
      <section className='space-y-4 rounded-lg border p-5'>
        <h2 className='text-xl font-semibold'>Add an external-only project</h2>
        <CatalogForm operation='manual' label='Create manual project'>
          <label className='block text-sm'>
            Project name
            <Input name='name' required maxLength={150} />
          </label>
          <label className='block text-sm'>
            Original description
            <Textarea name='description' required maxLength={2000} />
          </label>
          <label className='block text-sm'>
            Authors (comma-separated)
            <Input name='authors' maxLength={1000} />
          </label>
          <label className='block text-sm'>
            Categories (comma-separated)
            <Input name='categories' maxLength={1000} />
          </label>
          <label className='block text-sm'>
            Publisher URL
            <Input name='url' type='url' required placeholder='https://…' />
          </label>
          <label className='block text-sm'>
            Evidence and reason
            <Textarea name='reason' required minLength={10} maxLength={2000} />
          </label>
          <p className='text-xs text-muted-foreground'>
            Write an original summary or use author-permitted text. No scraping
            or copying marketplace descriptions. Versions and support stay
            unknown.
          </p>
        </CatalogForm>
      </section>
      <section className='space-y-4 rounded-lg border p-5'>
        <h2 className='text-xl font-semibold'>Merge reviewed identities</h2>
        <CatalogForm operation='merge' label='Merge projects'>
          <label className='block text-sm'>
            Project ID to redirect
            <Input name='from' required />
          </label>
          <label className='block text-sm'>
            Canonical project ID to keep
            <Input name='into' required />
          </label>
          <label className='block text-sm'>
            Identity evidence and reason
            <Textarea name='reason' required minLength={10} maxLength={2000} />
          </label>
          <p className='text-xs text-muted-foreground'>
            Sources and release IDs are preserved. The old URL redirects; the
            target’s curated fields take precedence. Record author confirmation
            or matching official repository evidence.
          </p>
        </CatalogForm>
      </section>
      <section className='space-y-4 rounded-lg border p-5'>
        <h2 className='text-xl font-semibold'>Curate an overview</h2>
        <CatalogForm operation='curate' label='Save curated overview'>
          <label className='block text-sm'>
            Project ID
            <Input name='projectId' required />
          </label>
          <label className='block text-sm'>
            Display name
            <Input name='name' required maxLength={150} />
          </label>
          <label className='block text-sm'>
            Description
            <Textarea name='description' required maxLength={2000} />
          </label>
          <label className='block text-sm'>
            Reason
            <Textarea name='reason' required minLength={10} maxLength={2000} />
          </label>
          <p className='text-xs text-muted-foreground'>
            These fields will survive future source refreshes. The project URL
            stays stable.
          </p>
        </CatalogForm>
      </section>
      <section>
        <h2 className='text-xl font-semibold'>Recently refreshed projects</h2>
        <ul className='mt-4 divide-y'>
          {projects.map((p) => (
            <li key={p.id} className='py-3'>
              <Link className='text-primary underline' href={catalogHref(p)}>
                {p.name}
              </Link>
              <p className='break-all font-mono text-xs text-muted-foreground'>
                {p.id}
              </p>
            </li>
          ))}
        </ul>
        <Link href='/discover/plugins' className='mt-4 inline-block underline'>
          Search the full catalog
        </Link>
      </section>
    </main>
  );
}
