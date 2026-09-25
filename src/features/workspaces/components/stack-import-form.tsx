'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  commitStackImportAction,
  previewStackImportAction,
} from '@/features/workspaces/actions/stack.actions';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';

export default function StackImportForm({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [preview, previewAction, previewPending] = useActionState(
    previewStackImportAction.bind(null, workspaceId),
    {},
  );
  const [result, commitAction, commitPending] = useActionState(
    commitStackImportAction.bind(null, workspaceId),
    {},
  );
  return (
    <div className='space-y-6'>
      <form action={previewAction} className='space-y-4'>
        <label className='block space-y-2 text-sm'>
          Plugin list or JSON manifest
          <Textarea
            name='text'
            required
            maxLength={50000}
            rows={8}
            className='font-mono text-xs'
            placeholder={
              'Oak Permissions\nhttps://modrinth.com/plugin/oak-permissions'
            }
          />
        </label>
        <p className='text-sm text-muted-foreground'>
          Up to 100 entries. Use one exact catalog name or source URL per line,
          or a JSON manifest. Imported version text is recorded as manual,
          without assuming a catalog release.
        </p>
        <details className='text-sm'>
          <summary className='cursor-pointer'>JSON format</summary>
          <pre className='mt-3 overflow-x-auto rounded-md bg-muted p-4 text-xs'>
            {
              '{"plugins":[{"project":"Oak Permissions","version":"1.0-custom"}]}'
            }
          </pre>
        </details>
        {preview.error && (
          <p role='alert' className='text-sm text-destructive'>
            {preview.error}
          </p>
        )}
        <Button disabled={previewPending || commitPending}>
          {previewPending ? 'Matching…' : 'Preview import'}
        </Button>
      </form>
      {preview.preview && (
        <form action={commitAction} className='space-y-4'>
          <h3 className='text-xl font-semibold'>Confirm matches</h3>
          <p className='text-sm text-muted-foreground'>
            Ambiguous rows require a choice. Unresolved rows remain unimported;
            add their projects to the catalog or correct the input and preview
            again. Existing stack entries are skipped without changing their
            notes or versions.
          </p>
          <input type='hidden' name='text' value={preview.text} />
          <fieldset
            disabled={commitPending || previewPending}
            className='divide-y border-y'
          >
            {preview.preview.map((row, i) => (
              <div
                key={`${preview.text}-${i}`}
                className='grid gap-3 py-4 sm:grid-cols-2'
              >
                <div className='min-w-0'>
                  <p className='break-all text-sm font-medium'>{row.project}</p>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {row.status}
                    {row.version ?
                      ` · manual version ${row.version}`
                    : ' · version unknown'}
                  </p>
                </div>
                {row.candidates.length > 0 ?
                  <label className='space-y-2 text-sm'>
                    Match for entry {i + 1}
                    <select
                      name={`choice-${i}`}
                      className={workspaceSelectClass}
                      defaultValue={
                        row.status === 'matched' ? row.candidates[0].id : ''
                      }
                    >
                      <option value=''>
                        {row.status === 'ambiguous' ?
                          'Choose a match or skip'
                        : 'Skip this entry'}
                      </option>
                      {row.candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} · {c.id}
                        </option>
                      ))}
                    </select>
                  </label>
                : <p className='text-sm text-muted-foreground'>
                    No exact catalog match.
                  </p>
                }
              </div>
            ))}
          </fieldset>
          <Button disabled={commitPending || previewPending}>
            {commitPending ? 'Importing…' : 'Import confirmed entries'}
          </Button>
        </form>
      )}
      {result.error && (
        <p role='alert' className='text-destructive'>
          {result.error}
        </p>
      )}
      {result.results && (
        <section aria-label='Import results' className='rounded-lg border p-5'>
          <h3 className='font-semibold'>Import results</h3>
          <p role='status' className='my-3 text-sm text-primary'>
            {result.message}
          </p>
          <ul className='space-y-2 text-sm'>
            {result.results.map((r, i) => (
              <li key={i} className='break-all'>
                {r.project}: {r.status}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
