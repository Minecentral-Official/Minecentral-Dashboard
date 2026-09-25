import Link from 'next/link';

import StackImportForm from '@/features/workspaces/components/stack-import-form';
import { loadWorkspace } from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function ImportStack({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  return (
    <div className='max-w-3xl space-y-6'>
      <Link
        href={`/servers/${workspaceId}/stack`}
        className='text-sm underline'
      >
        ← Plugin stack
      </Link>
      <h2 className='text-3xl font-semibold'>Import your stack</h2>
      {canUseWorkspace(workspace.role, 'content') && !workspace.archivedAt ?
        <StackImportForm workspaceId={workspaceId} />
      : <p>This workspace is read-only.</p>}
    </div>
  );
}
