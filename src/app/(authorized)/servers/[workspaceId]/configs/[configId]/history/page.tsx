import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { restoreConfigAction } from '@/features/workspaces/actions/config.actions';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';
import { configService } from '@/features/workspaces/queries/config-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import { configDiff } from '@/features/workspaces/services/config-diff';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function ConfigHistory({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string; configId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId, configId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  const actor = await workspaceActor();
  const history = await configService.history(actor, workspaceId, configId);
  const query = await searchParams;
  const from =
    history.find((r) => r.number === Number(query.from))?.number ??
    history[1]?.number ??
    history[0].number;
  const to =
    history.find((r) => r.number === Number(query.to))?.number ??
    history[0].number;
  const pair = await configService.compare(
    actor,
    workspaceId,
    configId,
    from,
    to,
  );
  const diff = configDiff(pair.from.content, pair.to.content);
  const base = `/servers/${workspaceId}/configs/${configId}`;
  const editable =
    !workspace.archivedAt && canUseWorkspace(workspace.role, 'content');
  return (
    <div className='max-w-5xl space-y-6'>
      <Link href={base} className='text-sm underline'>
        ← Back to editor
      </Link>
      <header>
        <h2 className='text-3xl font-semibold'>Revision history</h2>
        <p className='mt-2 break-all font-mono text-sm text-muted-foreground'>
          {pair.file.path}
        </p>
      </header>
      <p className='text-sm text-muted-foreground'>
        The last 20 revisions are retained. Restoring creates a new revision; it
        does not rewrite earlier content.
      </p>
      <form className='flex flex-wrap items-end gap-3'>
        {(['from', 'to'] as const).map((field) => (
          <label key={field} className='space-y-2 text-sm'>
            {field === 'from' ? 'Compare from' : 'Compare to'}
            <select
              name={field}
              defaultValue={field === 'from' ? from : to}
              className={workspaceSelectClass}
            >
              {history.map((r) => (
                <option key={r.id} value={r.number}>
                  Revision {r.number} · {r.source}
                </option>
              ))}
            </select>
          </label>
        ))}
        <Button variant='outline'>Compare revisions</Button>
      </form>
      {diff.identical ?
        <p>The contents are identical.</p>
      : <div
          className='overflow-x-auto rounded-lg border'
          aria-label='Revision diff'
        >
          <pre className='p-4 font-mono text-xs leading-6'>
            {diff.rows.map((r, i) => (
              <div
                key={i}
                className={
                  r.kind === 'removed' ?
                    'bg-red-500/10 text-red-700 dark:text-red-400'
                  : r.kind === 'added' ?
                    'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
                }
              >
                <span className='select-none'>
                  {String(r.oldLine ?? '').padStart(4)}{' '}
                  {String(r.newLine ?? '').padStart(4)}{' '}
                  {r.kind === 'removed' ?
                    '-'
                  : r.kind === 'added' ?
                    '+'
                  : ' '}{' '}
                </span>
                {r.text || ' '}
              </div>
            ))}
          </pre>
        </div>
      }
      {diff.truncated && (
        <p className='text-sm'>
          Showing the first 1,000 diff lines. Open the raw revisions below for
          all content.
        </p>
      )}
      <details>
        <summary className='cursor-pointer text-sm'>
          View raw compared revisions
        </summary>
        <div className='mt-4 grid gap-4 lg:grid-cols-2'>
          {[pair.from, pair.to].map((r, i) => (
            <section key={i}>
              <h3 className='mb-2 text-sm'>Revision {r.number}</h3>
              <pre className='max-h-96 overflow-auto rounded-lg border p-4 text-xs'>
                {r.content}
              </pre>
            </section>
          ))}
        </div>
      </details>
      {editable && from !== pair.file.currentRevision && (
        <details className='rounded-lg border p-4'>
          <summary className='cursor-pointer font-medium'>
            Restore revision {from}
          </summary>
          <div className='mt-4 space-y-3'>
            <p className='text-sm'>
              This replaces the current saved content with revision {from}.
              Download your current config first if needed.
            </p>
            <WorkspaceActionForm
              action={restoreConfigAction.bind(
                null,
                workspaceId,
                configId,
                from,
              )}
              label='Restore revision'
            >
              <input
                type='hidden'
                name='expectedRevision'
                value={pair.file.currentRevision}
              />
              <label className='flex items-start gap-2 text-sm'>
                <input type='checkbox' name='confirmed' required />I confirm
                restoring this revision as a new current revision.
              </label>
            </WorkspaceActionForm>
            <Link href={base} className='inline-block text-sm underline'>
              Cancel and return to editor
            </Link>
          </div>
        </details>
      )}
      <ul className='divide-y border-y'>
        {history.map((r) => (
          <li key={r.id} className='space-y-2 py-4'>
            <p className='text-sm font-semibold'>
              Revision {r.number} · {r.source}
              {r.number === pair.file.currentRevision ? ' · current' : ''}
            </p>
            <p className='text-xs text-muted-foreground'>
              {r.author ?? 'Deleted account'} ·{' '}
              {r.createdAt.toISOString().slice(0, 16).replace('T', ' ')} UTC
            </p>
            {r.message && <p className='break-words text-sm'>{r.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
