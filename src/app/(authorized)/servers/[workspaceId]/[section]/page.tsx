import Link from 'next/link';
import { notFound } from 'next/navigation';

import { loadWorkspace } from '@/features/workspaces/queries/workspace-access';

const descriptions: Record<string, [string, string]> = {
  updates: [
    'Updates',
    'Update readiness needs a recorded stack and version evidence. Those tools are not available yet.',
  ],
  diagnostics: [
    'Diagnostics',
    'Log analysis and the optional server agent are not available yet. This workspace has no live server connection.',
  ],
};
export default async function WorkspaceSection({
  params,
}: {
  params: Promise<{ workspaceId: string; section: string }>;
}) {
  const { workspaceId, section } = await params;
  const workspace = await loadWorkspace(workspaceId);
  if (!Object.hasOwn(descriptions, section)) notFound();
  const [title, description] = descriptions[section];
  return (
    <section className='max-w-2xl rounded-lg border border-dashed p-6 sm:p-9'>
      <p className='text-xs uppercase tracking-widest text-muted-foreground'>
        Not configured
      </p>
      <h2 className='my-3 text-2xl font-semibold'>{title}</h2>
      <p className='leading-relaxed text-muted-foreground'>{description}</p>
      <Link
        href={`/servers/${workspace.id}/settings`}
        className='mt-6 inline-block text-sm text-primary underline underline-offset-4'
      >
        Review workspace settings
      </Link>
    </section>
  );
}

// Private workspace data is authorized at request time; loading.tsx supplies navigation feedback.
export const instant = false;
