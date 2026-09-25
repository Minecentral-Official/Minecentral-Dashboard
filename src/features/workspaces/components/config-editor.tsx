'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveConfigAction } from '@/features/workspaces/actions/config.actions';
import ConfigWorkbench from '@/features/workspaces/components/config-workbench';
import { CONFIG_MAX_BYTES } from '@/features/workspaces/schemas/config-input';
import { inspectConfig } from '@/features/workspaces/services/config-yaml';

import type {
  ConfigDiagnostic,
  ConfigProfile,
} from '@/features/workspaces/schemas/config-input';
import type { SchemaSelection } from '@/features/workspaces/services/visual-schema-service';

export default function ConfigEditor({
  workspaceId,
  configId,
  initialContent,
  revision,
  profile,
  editable,
  selection,
}: {
  workspaceId: string;
  configId: string;
  initialContent: string;
  revision: number;
  profile: ConfigProfile;
  editable: boolean;
  selection: SchemaSelection;
}) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(initialContent);
  const [head, setHead] = useState(revision);
  const [seenRevision, setSeenRevision] = useState(revision);
  const [local, setLocal] = useState<ConfigDiagnostic[] | null>(null);
  const [notice, setNotice] = useState('');
  const textarea = useRef<HTMLTextAreaElement>(null);
  const dirty = content !== saved;
  const [state, action, pending] = useActionState(
    async (
      previous: {
        error?: string;
        message?: string;
        diagnostics?: ConfigDiagnostic[];
        revision?: number;
      },
      data: FormData,
    ) => {
      // Pass text separately: multipart form fields normalize newlines.
      data.delete('content');
      const result = await saveConfigAction(
        workspaceId,
        configId,
        previous,
        data,
        content,
      );
      if (result.revision) {
        setHead(result.revision);
        setSaved(content);
      }
      setLocal(null);
      return result;
    },
    {},
  );
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const navigate = (event: MouseEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest('a') : null;
      if (
        target &&
        !target.hasAttribute('download') &&
        target.target !== '_blank' &&
        !window.confirm('Leave without saving your YAML changes?')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', unload);
    document.addEventListener('click', navigate, true);
    return () => {
      window.removeEventListener('beforeunload', unload);
      document.removeEventListener('click', navigate, true);
    };
  }, [dirty]);
  // A preserved Next Activity can return with newer server props. Refresh only
  // pristine editor state; a dirty draft retains its old optimistic revision.
  if (seenRevision !== revision) {
    setSeenRevision(revision);
    if (!dirty && !pending) {
      setContent(initialContent);
      setSaved(initialContent);
      setHead(revision);
    }
  }
  const diagnostics = local ?? state.diagnostics ?? [];
  const base = `/servers/${workspaceId}/configs/${configId}`;
  return (
    <form
      action={action}
      onReset={(event) => event.preventDefault()}
      onSubmit={(event) => {
        if (new TextEncoder().encode(content).length > CONFIG_MAX_BYTES) {
          event.preventDefault();
          setLocal(inspectConfig(content, profile).diagnostics);
        }
      }}
      className='space-y-4'
    >
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='font-mono text-xs text-muted-foreground'>
          Revision {head} · {dirty ? 'Unsaved changes' : 'Saved'} ·{' '}
          {profile === 'syntax' ? 'Syntax only' : 'Basic Bukkit checks'}
        </p>
        <Link href={`${base}/history`} className='text-sm underline'>
          History
        </Link>
      </div>
      {revision !== head && (
        <p role='status' className='text-sm'>
          A newer revision is available. Copy your draft before reloading to
          compare it.
        </p>
      )}
      <fieldset disabled={pending} className='space-y-4'>
        <input type='hidden' name='expectedRevision' value={head} />
        <ConfigWorkbench
          content={content}
          onChange={(text) => {
            setContent(text);
            setLocal(null);
            setNotice('');
          }}
          selection={selection}
          disabled={!editable || pending}
          raw={
            <label className='block space-y-2 text-sm'>
              YAML content
              <textarea
                ref={textarea}
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Consolas, monospace',
                }}
                name='content'
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setLocal(null);
                  setNotice('');
                }}
                readOnly={!editable}
                spellCheck={false}
                rows={22}
                className='w-full rounded-lg border bg-background p-4 font-mono text-sm leading-6 focus-visible:outline-primary'
              />
            </label>
          }
        />
        <div className='flex flex-wrap items-center gap-3'>
          {editable && (
            <Button type='submit'>
              {pending ? 'Saving…' : 'Save changes'}
            </Button>
          )}
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              const result = inspectConfig(content, profile);
              setLocal(result.diagnostics);
              setNotice(
                result.valid ?
                  result.diagnostics.length ?
                    'YAML syntax is valid. Review the schema warnings.'
                  : 'YAML syntax is valid.'
                : 'Fix the errors below.',
              );
            }}
          >
            Check YAML
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={async () => {
              if (dirty || !inspectConfig(content, profile).valid) {
                setNotice('Save valid changes before copying or downloading.');
                return;
              }
              try {
                await navigator.clipboard.writeText(saved);
                setNotice('Saved YAML copied.');
              } catch {
                setNotice(
                  'Clipboard access is unavailable. Use Download YAML.',
                );
              }
            }}
          >
            Copy YAML
          </Button>
          {dirty ?
            <span className='text-sm text-muted-foreground'>
              Save before downloading
            </span>
          : <a
              href={`/api/workspaces/${workspaceId}/configs/${configId}/download`}
              download
              className='text-sm underline'
            >
              Download YAML
            </a>
          }
        </div>
        {editable && (
          <details>
            <summary className='cursor-pointer text-sm text-muted-foreground'>
              Add a change note
            </summary>
            <Input
              name='message'
              aria-label='Change note'
              maxLength={500}
              className='mt-3'
              placeholder='What changed?'
            />
          </details>
        )}
      </fieldset>
      {state.error && (
        <p role='alert' className='text-sm text-red-700 dark:text-red-400'>
          {state.error}
        </p>
      )}
      {(notice || state.message) && (
        <p role='status' className='text-sm'>
          {notice || state.message}
        </p>
      )}
      {diagnostics.length > 0 && (
        <ul
          className='space-y-2 rounded-lg border p-4'
          aria-label='Validation messages'
        >
          {diagnostics.map((d, i) => (
            <li
              key={i}
              className={`text-sm ${d.severity === 'error' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}
            >
              <button
                type='button'
                className='text-left underline decoration-dotted'
                onClick={() => {
                  if (!d.line) return;
                  const offset =
                    (textarea.current?.value ?? content)
                      .split('\n')
                      .slice(0, d.line - 1)
                      .reduce((n, line) => n + line.length + 1, 0) +
                    (d.column ?? 1) -
                    1;
                  textarea.current?.focus();
                  textarea.current?.setSelectionRange(offset, offset);
                }}
              >
                {d.category === 'schema' ?
                  d.severity === 'error' ?
                    'Schema error'
                  : 'Schema warning'
                : 'YAML error'}
                {d.line ? ` · Line ${d.line}, column ${d.column}` : ''}:{' '}
                {d.message}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
