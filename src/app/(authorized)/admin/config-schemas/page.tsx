import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  publishVisualSchema,
  retireVisualSchema,
} from '@/features/workspaces/actions/visual-schema.actions';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { visualSchemas } from '@/features/workspaces/queries/visual-schema-access';
import requirePermission from '@/lib/auth/helpers/require-permission';

export const instant = false;
export default async function ConfigSchemas() {
  const session = await requirePermission('catalog:curate');
  const releases = await visualSchemas.list(session.user.id);
  return (
    <main className='mx-auto max-w-4xl space-y-8 p-4'>
      <Link href='/admin/catalog' className='text-sm underline'>
        ← Catalog curation
      </Link>
      <header>
        <h1 className='text-3xl font-semibold'>Visual config schemas</h1>
        <p className='mt-3 text-muted-foreground'>
          Publish reviewed setting definitions for a specific file, platform and
          version range. Schemas never change a user’s saved YAML automatically.
        </p>
      </header>
      <section className='space-y-4 rounded-lg border p-5'>
        <h2 className='text-xl font-semibold'>Publish a schema release</h2>
        <p className='text-sm'>
          Use formatVersion 1, an increasing release number and a source URL.
          Verify defaults against the publisher’s config. See
          docs/development/visual-config-editor.md in the repository for the
          format and example.
        </p>
        <WorkspaceActionForm
          action={publishVisualSchema}
          label='Publish schema release'
          preserveValues
        >
          <label className='block text-sm'>
            Canonical project ID (plugin schemas only)
            <Input
              name='projectId'
              placeholder='Catalog project UUID; blank for a server file'
            />
          </label>
          <label className='block text-sm'>
            Schema JSON
            <Textarea
              name='definition'
              required
              rows={18}
              maxLength={65536}
              spellCheck={false}
              className='font-mono'
            />
          </label>
        </WorkspaceActionForm>
      </section>
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>Latest 100 releases</h2>
        {!releases.length && (
          <p>
            No schemas have been published. Unsupported files remain editable as
            YAML.
          </p>
        )}
        {releases.map((r) => (
          <article key={r.id} className='space-y-3 rounded-lg border p-4'>
            <h3 className='font-semibold'>
              {r.definition.title} · release {r.release}
              {r.retired ? ' · retired' : ''}
            </h3>
            <p className='text-sm'>
              {r.key} · {r.definition.filename} · {r.definition.target.platform}{' '}
              {r.definition.target.versionRange}
            </p>
            <p className='break-all text-xs'>
              Project: {r.projectId ?? 'Server config'} · verified{' '}
              {r.definition.provenance.verifiedVersion}
            </p>
            <details>
              <summary className='cursor-pointer text-sm'>
                View definition and provenance
              </summary>
              <pre className='max-h-96 overflow-auto p-3 text-xs'>
                {JSON.stringify(r.definition, null, 2)}
              </pre>
            </details>
            {!r.retired && (
              <WorkspaceActionForm
                action={retireVisualSchema.bind(null, r.id)}
                label='Retire release'
                destructive
              >
                <label className='flex gap-2 text-sm'>
                  <input type='checkbox' name='confirmed' required />
                  Retire this release from automatic selection. Saved configs
                  are retained.
                </label>
              </WorkspaceActionForm>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
