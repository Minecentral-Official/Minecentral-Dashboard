'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import VisualFields from '@/features/workspaces/components/visual-fields';
import { configDiff } from '@/features/workspaces/services/config-diff';
import { inspectConfig } from '@/features/workspaces/services/config-yaml';
import {
  editVisual,
  fieldIssues,
  nodeValue,
  templateDocument,
  visualDocument,
} from '@/features/workspaces/services/visual-document';

import type { VisualEdit } from '@/features/workspaces/services/visual-document';
import type { SchemaSelection } from '@/features/workspaces/services/visual-schema-service';
import type { ReactNode } from 'react';

export default function ConfigWorkbench({
  content,
  onChange,
  selection,
  disabled,
  raw,
}: {
  content: string;
  onChange: (text: string) => void;
  selection: SchemaSelection;
  disabled: boolean;
  raw: ReactNode;
}) {
  const [mode, setMode] = useState<'visual' | 'yaml' | 'split'>('yaml');
  const [search, setSearch] = useState('');
  const [lastValid, setLastValid] = useState(
    inspectConfig(content).valid ? content : '{}\n',
  );
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{
    before: string;
    after: string;
  } | null>(null);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const inspected = useMemo(() => inspectConfig(content), [content]);
  if (inspected.valid && lastValid !== content) setLastValid(content);
  const root = useMemo(
    () => nodeValue(visualDocument(lastValid).contents),
    [lastValid],
  );
  const schema = selection.schema;
  const issues = schema ? fieldIssues(schema.root, root) : [];
  function edit(operation: VisualEdit) {
    try {
      onChange(editVisual(content, operation));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not edit this value.');
    }
  }
  const visual =
    schema ?
      <div className='max-h-[65vh] min-w-0 space-y-5 overflow-y-auto pr-2'>
        <label className='block text-sm'>
          Find a setting
          <Input
            type='search'
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.preventDefault();
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Name, path or explanation'
          />
        </label>
        {!inspected.valid && (
          <p
            role='alert'
            className='rounded-md border border-amber-600 p-3 text-sm'
          >
            YAML is invalid. The last valid visual values are shown read-only.
            Fix the YAML to continue.
          </p>
        )}
        {issues.some((i) => i.severity === 'error') && (
          <p role='status' className='text-sm'>
            Review the field errors below. YAML remains available for
            unsupported values.
          </p>
        )}
        <VisualFields
          field={schema.root}
          value={root}
          root={root}
          search={search.trim().toLowerCase()}
          edit={edit}
          disabled={disabled || !inspected.valid}
        />
        <details className='border-t pt-4'>
          <summary className='cursor-pointer text-sm'>
            Defaults and schema details
          </summary>
          <div className='mt-3 space-y-3 text-sm'>
            <p>{schema.provenance.description}</p>
            <p>
              Verified for {schema.provenance.verifiedVersion} on{' '}
              {schema.provenance.verifiedAt.slice(0, 10)}. Coverage:{' '}
              {schema.target.versionRange}. Unknown settings remain in YAML.
            </p>
            <a
              className='underline'
              href={schema.provenance.url}
              target='_blank'
              rel='noreferrer'
            >
              Schema source
            </a>
            <p>
              Generating a template replaces the entire draft, including unknown
              settings. Review the diff first. It is not saved until you choose
              Save changes.
            </p>
            <Button
              type='button'
              variant='outline'
              disabled={disabled}
              onClick={() => {
                try {
                  setPreview({
                    before: content,
                    after: templateDocument(schema),
                  });
                  setError('');
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : 'Defaults unavailable.',
                  );
                }
              }}
            >
              Preview default template
            </Button>
          </div>
        </details>
      </div>
    : null;
  const show = schema ? mode : 'yaml';
  return (
    <div className='space-y-4'>
      <input
        type='hidden'
        name='schemaReleaseId'
        value={selection.releaseId ?? ''}
      />
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div
          role='group'
          aria-label='Editor mode'
          className='flex rounded-lg border p-1'
        >
          {(['visual', 'yaml', 'split'] as const).map((m) => (
            <Button
              key={m}
              type='button'
              size='sm'
              variant={show === m ? 'secondary' : 'ghost'}
              aria-pressed={show === m}
              disabled={m !== 'yaml' && !schema}
              onClick={(e) => {
                if (e.currentTarget.form?.reportValidity()) setMode(m);
              }}
            >
              {m === 'yaml' ?
                'YAML'
              : m === 'visual' ?
                'Visual'
              : 'Split'}
            </Button>
          ))}
        </div>
        <p className='text-xs text-muted-foreground'>{selection.reason}</p>
      </div>
      {show === 'split' ?
        desktop ?
          <ResizablePanelGroup
            direction='horizontal'
            className='min-h-96 items-start'
            autoSaveId={undefined}
          >
            <ResizablePanel minSize={25} defaultSize={50}>
              <div className='min-w-0 pr-4'>{visual}</div>
            </ResizablePanel>
            <ResizableHandle withHandle aria-label='Resize editor panels' />
            <ResizablePanel minSize={25} defaultSize={50}>
              <div className='min-w-0 pl-4'>{raw}</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        : <div className='space-y-6'>
            {visual}
            <div className='border-t pt-4'>{raw}</div>
          </div>

      : show === 'visual' ?
        visual
      : raw}
      {!inspected.valid && (
        <ul
          aria-label='Live YAML errors'
          className='text-sm text-red-700 dark:text-red-400'
        >
          {inspected.diagnostics.map((d, i) => (
            <li key={i}>
              {d.line ? `Line ${d.line}, column ${d.column}: ` : ''}
              {d.message}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role='alert' className='text-sm text-red-700 dark:text-red-400'>
          {error}
        </p>
      )}
      {preview && (
        <section
          aria-label='Default template preview'
          className='space-y-4 rounded-lg border p-4'
        >
          <h3 className='font-semibold'>Replace the whole draft?</h3>
          <p className='text-sm'>
            Removed lines start with −; added lines start with +. Unknown
            settings may be removed.
          </p>
          <pre className='max-h-80 overflow-auto text-xs'>
            {configDiff(preview.before, preview.after).rows.map((r, i) => (
              <div
                key={i}
                className={
                  r.kind === 'removed' ? 'text-red-700 dark:text-red-400'
                  : r.kind === 'added' ?
                    'text-primary'
                  : ''
                }
              >
                {r.kind === 'removed' ?
                  '-'
                : r.kind === 'added' ?
                  '+'
                : ' '}{' '}
                {r.text}
              </div>
            ))}
          </pre>
          {configDiff(preview.before, preview.after).truncated && (
            <p>
              Diff shortened to 1,000 lines. Complete replacement YAML appears
              below.
            </p>
          )}
          <details>
            <summary className='cursor-pointer text-sm'>
              Complete replacement YAML
            </summary>
            <pre className='max-h-80 overflow-auto text-xs'>
              {preview.after}
            </pre>
          </details>
          <div className='flex flex-wrap gap-3'>
            <Button
              type='button'
              disabled={disabled}
              onClick={() => {
                if (content !== preview.before) {
                  setError(
                    'The draft changed after this preview. Generate a new preview.',
                  );
                  return;
                }
                onChange(preview.after);
                setPreview(null);
              }}
            >
              Replace draft with defaults
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => setPreview(null)}
            >
              Cancel replacement
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
