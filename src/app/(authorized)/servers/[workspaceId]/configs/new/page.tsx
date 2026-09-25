import Link from 'next/link';

import ConfigImportForm from '@/features/workspaces/components/config-import-form';
import { configService } from '@/features/workspaces/queries/config-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function NewConfig({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  if (workspace.archivedAt || !canUseWorkspace(workspace.role, 'content'))
    return <p>This workspace is read-only.</p>;
  const choices = await configService.choices(
    await workspaceActor(),
    workspaceId,
  );
  const query = await searchParams;
  const entryId =
    choices.some((c) => c.id === query.entryId) ?
      String(query.entryId)
    : undefined;
  return (
    <div className='max-w-3xl space-y-6'>
      <Link
        href={`/servers/${workspaceId}/configs`}
        className='text-sm underline'
      >
        ← Configs
      </Link>
      <header>
        <h2 className='text-3xl font-semibold'>Import a config</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Upload or paste UTF-8 YAML, up to 128 KiB. Files stay private to this
          workspace.
        </p>
      </header>
      <ConfigImportForm
        workspaceId={workspaceId}
        choices={choices}
        entryId={entryId}
      />
    </div>
  );
}
