import Link from 'next/link';

import WorkspaceNavigation from '@/features/workspaces/components/workspace-navigation';
import { loadWorkspace } from '@/features/workspaces/queries/workspace-access';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = await loadWorkspace((await params).workspaceId);
  return (
    <div className='space-y-6'>
      <header className='space-y-3'>
        <Link href='/servers' className='text-sm text-muted-foreground'>
          ← All workspaces
        </Link>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div className='min-w-0'>
            <p className='mb-1 text-xs uppercase tracking-widest text-muted-foreground'>
              {workspace.visibility === 'private' ?
                'Private workspace'
              : 'Team workspace'}{' '}
              · {workspace.role}
            </p>
            <h1 className='break-words text-3xl font-semibold tracking-tight'>
              {workspace.name}
            </h1>
          </div>
          <p className='rounded-md border-l-2 border-primary bg-card px-4 py-2 font-mono text-xs'>
            Paper / {workspace.minecraftVersion} /{' '}
            {workspace.javaVersion ?
              `Java ${workspace.javaVersion}`
            : 'Java not recorded'}
          </p>
        </div>
        {workspace.archivedAt && (
          <p
            role='status'
            className='rounded-md border border-amber-600/40 bg-amber-500/10 p-3 text-sm'
          >
            Archived workspace. Settings and content are read-only. The owner
            can restore it in Settings.
          </p>
        )}
      </header>
      <WorkspaceNavigation id={workspace.id} />
      <main>{children}</main>
    </div>
  );
}

// Private workspace data is authorized at request time; loading.tsx supplies navigation feedback.
export const instant = false;
