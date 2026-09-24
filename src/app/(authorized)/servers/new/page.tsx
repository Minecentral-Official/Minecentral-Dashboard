import Link from 'next/link';

import { createWorkspaceAction } from '@/features/workspaces/actions/workspace.actions';
import WorkspaceForm from '@/features/workspaces/components/workspace-form';
import { workspaceActor } from '@/features/workspaces/queries/workspace-access';

export default async function NewWorkspace() {
  await workspaceActor();
  return (
    <main className='mx-auto max-w-2xl space-y-6'>
      <Link href='/servers' className='text-sm text-muted-foreground'>
        ← My Servers
      </Link>
      <div>
        <h1 className='text-3xl font-semibold tracking-tight'>
          Create a server workspace
        </h1>
        <p className='mt-2 text-muted-foreground'>
          Start with the server you’re planning or already running. Your
          workspace is private; creating it does not buy or provision hosting.
        </p>
      </div>
      <section className='rounded-lg border bg-card p-5 sm:p-7'>
        <WorkspaceForm action={createWorkspaceAction} />
      </section>
    </main>
  );
}

// Private workspace data is authorized at request time; loading.tsx supplies navigation feedback.
export const instant = false;
