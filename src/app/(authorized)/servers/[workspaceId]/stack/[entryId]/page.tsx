import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  metadataStackAction,
  removeStackAction,
  versionStackAction,
} from '@/features/workspaces/actions/stack.actions';
import CommunityReportForm from '@/features/workspaces/components/community-report-form';
import StackVersionFields from '@/features/workspaces/components/stack-version-fields';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { stackService } from '@/features/workspaces/queries/stack-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import {
  canUseWorkspace,
  WorkspaceError,
} from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function StackEntry({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string; entryId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId, entryId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  const actor = await workspaceActor();
  const query = await searchParams;
  const record = await stackService
    .detail(actor, workspaceId, entryId)
    .catch((error) => {
      if (error instanceof WorkspaceError) notFound();
      throw error;
    });
  const releases = await stackService.releases(
    actor,
    workspaceId,
    record.projectId,
    { all: query.all === 'true', page: Number(query.page) },
  );
  const editable =
    canUseWorkspace(workspace.role, 'content') && !workspace.archivedAt;
  const base = `/servers/${workspaceId}/stack`;
  const href = (page: number, all = query.all === 'true') =>
    `${base}/${entryId}?all=${all}&page=${page}`;
  return (
    <div className='max-w-3xl space-y-7'>
      <Link href={base} className='text-sm underline'>
        ← Plugin stack
      </Link>
      <header>
        <h2 className='text-3xl font-semibold'>{releases.project.name}</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Private to this workspace · Added via {record.addedVia}
        </p>
      </header>
      <section className='space-y-4 rounded-lg border p-5'>
        <h3 className='text-xl font-semibold'>Installed version</h3>
        <p className='text-sm text-muted-foreground'>
          Source: {record.versionSource} · Changed{' '}
          {record.versionChangedAt.toISOString().slice(0, 16).replace('T', ' ')}{' '}
          UTC
        </p>
        <Link
          href={href(1, query.all !== 'true')}
          className='inline-block text-sm underline'
        >
          {query.all === 'true' ?
            'Show relevant releases'
          : 'Show all releases'}
        </Link>
        <fieldset disabled={!editable}>
          <WorkspaceActionForm
            key={`${entryId}-${query.page}-${query.all}`}
            action={versionStackAction.bind(null, workspaceId, entryId)}
            label='Save installed version'
          >
            <StackVersionFields releases={releases.rows} current={record} />
          </WorkspaceActionForm>
        </fieldset>
        <nav className='flex justify-between gap-4'>
          {releases.page > 1 && (
            <Link href={href(releases.page - 1)}>← Newer releases</Link>
          )}
          {releases.hasNext && (
            <Link href={href(releases.page + 1)}>Older releases →</Link>
          )}
        </nav>
      </section>
      <section className='rounded-lg border p-5'>
        <h3 className='mb-4 text-xl font-semibold'>
          Private notes and purpose
        </h3>
        <fieldset disabled={!editable}>
          <WorkspaceActionForm
            action={metadataStackAction.bind(null, workspaceId, entryId)}
            label='Save private metadata'
          >
            <label className='block space-y-2 text-sm'>
              Alias or purpose
              <Input name='alias' maxLength={150} defaultValue={record.alias} />
            </label>
            <label className='block space-y-2 text-sm'>
              Private notes
              <Textarea
                name='notes'
                maxLength={10000}
                defaultValue={record.notes}
                rows={5}
              />
            </label>
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                name='enabled'
                defaultChecked={record.enabled}
              />
              Enabled in this stack
            </label>
            <p className='text-xs text-muted-foreground'>
              This records your intended state; it does not change the running
              server.
            </p>
          </WorkspaceActionForm>
        </fieldset>
      </section>
      {editable && record.versionId && record.enabled && (
        <CommunityReportForm
          workspaceId={workspaceId}
          entryId={entryId}
          target={{
            versionId: record.versionId!,
            platform: workspace.platform,
            minecraftVersion: workspace.minecraftVersion,
          }}
        />
      )}
      {editable && (
        <details className='rounded-lg border border-destructive/30 p-5'>
          <summary className='cursor-pointer font-semibold'>
            Remove plugin
          </summary>
          <p className='my-4 text-sm text-muted-foreground'>
            Removal deletes this entry and its private notes. Workspace activity
            is retained. No server files are changed.
          </p>
          <WorkspaceActionForm
            action={removeStackAction.bind(null, workspaceId, entryId)}
            label='Remove from stack'
            destructive
          >
            <label className='flex items-start gap-2 text-sm'>
              <input type='checkbox' name='confirmed' required />I confirm
              removal of this entry and its private notes.
            </label>
          </WorkspaceActionForm>
        </details>
      )}
    </div>
  );
}
