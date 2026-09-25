import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Input } from '@/components/ui/input';
import {
  metadataConfigAction,
  removeConfigAction,
} from '@/features/workspaces/actions/config.actions';
import ConfigEditor from '@/features/workspaces/components/config-editor';
import ConfigMetadataFields from '@/features/workspaces/components/config-metadata-fields';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { configService } from '@/features/workspaces/queries/config-access';
import { visualSchemas } from '@/features/workspaces/queries/visual-schema-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import {
  canUseWorkspace,
  WorkspaceError,
} from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function ConfigDetail({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string; configId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId, configId } = await params;
  const query = await searchParams;
  const workspace = await loadWorkspace(workspaceId);
  const actor = await workspaceActor();
  const result = await configService
    .detail(actor, workspaceId, configId)
    .catch((error) => {
      if (error instanceof WorkspaceError) notFound();
      throw error;
    });
  const choices = await configService.choices(actor, workspaceId);
  const selection = await visualSchemas.select(actor, workspaceId, configId);
  const editable =
    !workspace.archivedAt && canUseWorkspace(workspace.role, 'content');
  const { file, current } = result;
  return (
    <div className='max-w-5xl space-y-6'>
      <Link
        href={`/servers/${workspaceId}/configs`}
        className='text-sm underline'
      >
        ← Configs
      </Link>
      <header>
        <h2 className='break-all font-mono text-2xl font-semibold'>
          {file.path}
        </h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Private to this workspace · Comments and unknown settings are
          preserved.
        </p>
      </header>
      {file.kind === 'plugin' && !file.entryId && (
        <p
          role='status'
          className='rounded-lg border border-amber-600/40 p-4 text-sm text-amber-700 dark:text-amber-400'
        >
          Orphaned config: its plugin was removed. Your file and history are
          intact. Use File settings to relink it or mark it intentionally
          unlinked.
        </p>
      )}
      <ConfigEditor
        key={`${file.id}:${String(query.restored ?? '')}`}
        workspaceId={workspaceId}
        configId={configId}
        initialContent={current.content}
        revision={current.number}
        profile={file.profile}
        editable={editable}
        selection={selection}
      />
      {editable && (
        <details className='rounded-lg border p-4'>
          <summary className='cursor-pointer font-medium'>
            File settings
          </summary>
          <div className='mt-5 max-w-xl space-y-6'>
            <WorkspaceActionForm
              action={metadataConfigAction.bind(null, workspaceId, configId)}
              label='Save file settings'
              preserveValues
            >
              <input
                type='hidden'
                name='expectedRevision'
                value={current.number}
              />
              <ConfigMetadataFields choices={choices} initial={file} />
            </WorkspaceActionForm>
            <details className='border-t pt-4'>
              <summary className='cursor-pointer text-sm text-red-700 dark:text-red-400'>
                Delete config and history
              </summary>
              <div className='mt-4'>
                <WorkspaceActionForm
                  action={removeConfigAction.bind(null, workspaceId, configId)}
                  label='Delete config'
                  destructive
                >
                  <input
                    type='hidden'
                    name='expectedRevision'
                    value={current.number}
                  />
                  <p className='text-sm'>
                    Download a copy first if you need it. This deletes the file
                    and all retained revisions.
                  </p>
                  <label className='block space-y-2 text-sm'>
                    Type the file path to confirm
                    <Input name='confirmation' required autoComplete='off' />
                  </label>
                </WorkspaceActionForm>
              </div>
            </details>
          </div>
        </details>
      )}
    </div>
  );
}
