'use client';

import { useActionState, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createConfigAction } from '@/features/workspaces/actions/config.actions';
import ConfigMetadataFields from '@/features/workspaces/components/config-metadata-fields';
import { CONFIG_MAX_BYTES } from '@/features/workspaces/schemas/config-input';

import type { ConfigFormState } from '@/features/workspaces/schemas/config-input';

export default function ConfigImportForm({
  workspaceId,
  choices,
  entryId,
}: {
  workspaceId: string;
  choices: { id: string; name: string }[];
  entryId?: string;
}) {
  const [content, setContent] = useState('');
  const [state, action, pending] = useActionState(
    async (previous: ConfigFormState, data: FormData) => {
      // Pass text separately: multipart form fields normalize newlines.
      data.delete('content');
      return createConfigAction(workspaceId, previous, data, content);
    },
    {},
  );
  const [uploadError, setUploadError] = useState('');
  return (
    <form
      action={action}
      onReset={(event) => event.preventDefault()}
      onSubmit={(event) => {
        if (new TextEncoder().encode(content).length > CONFIG_MAX_BYTES) {
          event.preventDefault();
          setUploadError(
            'YAML exceeds 128 KiB. Reduce the content before importing.',
          );
        }
      }}
      className='space-y-5'
    >
      <fieldset disabled={pending} className='space-y-5'>
        <label className='block space-y-2 text-sm'>
          Upload YAML (optional)
          <Input
            type='file'
            name='upload'
            accept='.yml,.yaml'
            onChange={async (e) => {
              const input = e.currentTarget;
              const file = input.files?.[0];
              if (!file) return;
              if (
                !/\.ya?ml$/i.test(file.name) ||
                file.size > CONFIG_MAX_BYTES
              ) {
                setUploadError('Choose a .yml or .yaml file up to 128 KiB.');
                input.value = '';
                return;
              }
              try {
                const text = new TextDecoder('utf-8', { fatal: true }).decode(
                  await file.arrayBuffer(),
                );
                setContent(text);
                setUploadError('');
              } catch {
                setUploadError('Choose a UTF-8 text file.');
                input.value = '';
              }
            }}
          />
        </label>
        {uploadError && (
          <p role='alert' className='text-sm text-red-700 dark:text-red-400'>
            {uploadError}
          </p>
        )}
        <label className='block space-y-2 text-sm'>
          YAML content
          <textarea
            name='content'
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            rows={14}
            className='w-full rounded-lg border bg-background p-4 font-mono text-sm leading-6 focus-visible:outline-primary'
            placeholder={
              '# Paste your existing configuration\nsettings:\n  allow-end: true\n'
            }
          />
        </label>
        <ConfigMetadataFields
          choices={choices}
          initial={{
            path: '',
            kind: entryId ? 'plugin' : 'server',
            entryId: entryId ?? null,
            profile: 'syntax',
          }}
        />
        {state.error && (
          <p role='alert' className='text-sm text-red-700 dark:text-red-400'>
            {state.error}
          </p>
        )}
        {state.diagnostics?.map((d, i) => (
          <p key={i} className='text-sm text-red-700 dark:text-red-400'>
            {d.line ? `Line ${d.line}, column ${d.column}: ` : ''}
            {d.message}
          </p>
        ))}
        <Button type='submit'>
          {pending ? 'Importing…' : 'Import config'}
        </Button>
      </fieldset>
    </form>
  );
}
