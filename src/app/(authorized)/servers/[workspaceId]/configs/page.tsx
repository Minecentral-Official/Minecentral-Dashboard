import Link from 'next/link';

import { configService } from '@/features/workspaces/queries/config-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function Configs({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  const files = await configService.list(await workspaceActor(), workspaceId);
  const editable =
    !workspace.archivedAt && canUseWorkspace(workspace.role, 'content');
  const base = `/servers/${workspaceId}/configs`;
  return (
    <div className='max-w-4xl space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-semibold'>Configs</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Your workspace’s private YAML files. Edit, keep history, and
            download when ready.
          </p>
        </div>
        {editable && (
          <Link
            href={`${base}/new`}
            className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'
          >
            Import config
          </Link>
        )}
      </header>
      {!files.length ?
        <section className='rounded-lg border border-dashed p-8'>
          <h3 className='text-xl font-semibold'>Bring your first config</h3>
          <p className='mt-3 max-w-lg text-sm text-muted-foreground'>
            Upload a .yml file or paste its contents. We keep your comments and
            key order; nothing is sent to your Minecraft server.
          </p>
        </section>
      : <ul className='divide-y border-y'>
          {files.map(({ file: f, projectName }) => (
            <li
              key={f.id}
              className='flex flex-wrap items-center justify-between gap-3 py-5'
            >
              <div className='min-w-0'>
                <Link
                  href={`${base}/${f.id}`}
                  className='break-all font-mono text-sm font-medium underline underline-offset-4'
                >
                  {f.path}
                </Link>
                <p className='mt-2 text-xs text-muted-foreground'>
                  {f.kind === 'plugin' ?
                    (projectName ?? 'Plugin')
                  : f.kind === 'server' ?
                    'Server config'
                  : 'Unlinked file'}{' '}
                  · Revision {f.currentRevision} ·{' '}
                  {f.updatedAt.toISOString().slice(0, 10)}
                </p>
              </div>
              {f.kind === 'plugin' && !f.entryId && (
                <span className='text-sm text-amber-700 dark:text-amber-400'>
                  Orphaned — plugin removed
                </span>
              )}
            </li>
          ))}
        </ul>
      }
      <p className='text-xs text-muted-foreground'>
        {files.length} / 50 files · 128 KiB per file · Last 20 revisions
        retained
      </p>
    </div>
  );
}
