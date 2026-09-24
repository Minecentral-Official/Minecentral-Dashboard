import Link from 'next/link';

import { withdrawCommunityAction } from '@/features/workspaces/actions/compatibility.actions';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { compatibilityService } from '@/features/workspaces/queries/compatibility-access';
import { workspaceActor } from '@/features/workspaces/queries/workspace-access';

export const instant = false;
export default async function MyReports({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const result = await compatibilityService.myReports(
    await workspaceActor(),
    Number((await searchParams).page),
  );
  const reports = result.rows;
  return (
    <main className='mx-auto max-w-3xl space-y-6 p-4'>
      <Link href='/servers' className='text-sm underline'>
        ← My Servers
      </Link>
      <h1 className='text-3xl font-semibold'>My community test reports</h1>
      <p className='text-sm text-muted-foreground'>
        Recent reports you opted to share. Individual details are only visible
        to you and curators. Approved reports contribute only after trust and
        volume requirements are met.
      </p>
      {!reports.length && (
        <p>
          You have not submitted any reports. Open a stack entry with a selected
          catalog version to record a test.
        </p>
      )}
      <ul className='divide-y border-y'>
        {reports.map(({ report: r, versionName, projectName }) => (
          <li key={r.id} className='space-y-3 py-5'>
            <h2 className='font-semibold'>
              {projectName} / {versionName}
            </h2>
            <p className='text-sm'>
              {r.platform} / {r.minecraftVersion} · {r.result} · {r.status}
            </p>
            <p className='whitespace-pre-wrap break-words text-sm text-muted-foreground'>
              {r.detail}
            </p>
            <p className='text-xs text-muted-foreground'>
              Observed {r.observedAt.toISOString().slice(0, 10)}
            </p>
            {r.status !== 'withdrawn' && (
              <WorkspaceActionForm
                action={withdrawCommunityAction.bind(null, r.id)}
                label='Withdraw report'
                destructive
              />
            )}
          </li>
        ))}
      </ul>
      <nav className='flex justify-between'>
        {result.page > 1 ?
          <Link href={`?page=${result.page - 1}`}>← Previous reports</Link>
        : <span />}
        {result.hasNext && (
          <Link href={`?page=${result.page + 1}`}>More reports →</Link>
        )}
      </nav>
    </main>
  );
}
