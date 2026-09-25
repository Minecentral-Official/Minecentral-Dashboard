import Link from 'next/link';

import { compatibilityService } from '@/features/workspaces/queries/compatibility-access';
import { stackService } from '@/features/workspaces/queries/stack-access';
import {
  loadWorkspace,
  workspaceActor,
  workspaceService,
} from '@/features/workspaces/queries/workspace-access';

export default async function WorkspaceOverview({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = await loadWorkspace((await params).workspaceId);
  const events = await workspaceService.recentActivity(
    await workspaceActor(),
    workspace.id,
  );
  const stackCount = await stackService.count(
    await workspaceActor(),
    workspace.id,
  );
  const compatibility = await compatibilityService.report(
    await workspaceActor(),
    workspace.id,
  );
  const summaries = [
    [
      'stack',
      'Plugins',
      String(stackCount),
      'Recorded plugins and installed versions.',
    ],
    [
      'compatibility',
      'Compatibility warnings',
      compatibility.report ?
        String(
          compatibility.report.summary.incompatible +
            compatibility.report.summary.conflicting +
            compatibility.report.summary.blocked,
        )
      : 'Unavailable',
      compatibility.report ?
        `${compatibility.report.summary.unknown} entries need runtime evidence.`
      : 'Open the report to retry the check.',
    ],
    [
      'updates',
      'Updates',
      'Not checked',
      'Version comparisons are not available yet.',
    ],
    [
      'configs',
      'Config issues',
      'Not checked',
      'No configuration files have been analyzed.',
    ],
    [
      'diagnostics',
      'Server agent',
      'Not connected',
      'Live server data is not available.',
    ],
  ];
  return (
    <div className='space-y-7'>
      <div>
        <h2 className='text-xl font-semibold'>Server overview</h2>
        <p className='mt-2 max-w-2xl text-muted-foreground'>
          {workspace.description ||
            'Your server has a home. Review its runtime, add private notes, or invite a teammate in Settings.'}
        </p>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {summaries.map(([section, title, value, help]) => (
          <Link
            key={title}
            href={`/servers/${workspace.id}/${section}`}
            className='rounded-lg border bg-card p-5 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <h3 className='text-sm text-muted-foreground'>{title}</h3>
            <p className='my-3 text-xl font-semibold'>{value}</p>
            <p className='text-sm text-muted-foreground'>{help}</p>
            <span className='mt-4 inline-block text-sm text-primary'>
              View {section} →
            </span>
          </Link>
        ))}
      </div>
      <section className='rounded-lg border p-5'>
        <h2 className='font-semibold'>Recent workspace activity</h2>
        <ul className='mt-4 divide-y'>
          {events.map((event) => (
            <li
              key={event.id}
              className='flex flex-wrap justify-between gap-2 py-3 text-sm'
            >
              <span>{event.event}</span>
              <time
                dateTime={event.createdAt.toISOString()}
                className='font-mono text-xs text-muted-foreground'
              >
                {event.createdAt.toISOString().slice(0, 16).replace('T', ' ')}{' '}
                UTC
              </time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// Private workspace data is authorized at request time; loading.tsx supplies navigation feedback.
export const instant = false;
