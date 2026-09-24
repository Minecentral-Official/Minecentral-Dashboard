import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitCommunityAction } from '@/features/workspaces/actions/compatibility.actions';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';

export default function CommunityReportForm({
  workspaceId,
  entryId,
  target,
}: {
  workspaceId: string;
  entryId: string;
  target: { versionId: string; platform: string; minecraftVersion: string };
}) {
  return (
    <details className='rounded-lg border p-5'>
      <summary className='cursor-pointer font-semibold'>
        Share a community test report
      </summary>
      <p className='my-4 text-sm text-muted-foreground'>
        Report a test you actually ran on this selected release and workspace
        runtime. Accounts must be seven days old. Reports need curator review;
        at least three independent approved reports are required before they
        contribute evidence.
      </p>
      <WorkspaceActionForm
        action={submitCommunityAction.bind(null, workspaceId, entryId, target)}
        label='Submit test report'
      >
        <label className='block space-y-2 text-sm'>
          Observed result
          <select name='result' className={workspaceSelectClass}>
            <option value='compatible'>Worked on this runtime</option>
            <option value='incompatible'>Failed on this runtime</option>
          </select>
        </label>
        <label className='block space-y-2 text-sm'>
          Test date
          <Input
            name='observedAt'
            type='date'
            required
            max={new Date().toISOString().slice(0, 10)}
          />
        </label>
        <label className='block space-y-2 text-sm'>
          Test details
          <Textarea
            name='detail'
            minLength={20}
            maxLength={1000}
            required
            placeholder='Describe the test and outcome. Do not include server addresses, tokens, player data or private notes.'
          />
        </label>
        <label className='flex items-start gap-2 text-sm'>
          <input name='consent' type='checkbox' required />I opt in to sharing
          these test details with curators and contributing anonymous aggregate
          evidence.
        </label>
        <p className='text-xs text-muted-foreground'>
          Workspace notes and connection details are never included. You can
          withdraw your report; its details are removed and it stops
          contributing to evidence.
        </p>
      </WorkspaceActionForm>
      <Link
        href='/servers/reports'
        className='mt-4 inline-block text-sm underline'
      >
        Manage my reports
      </Link>
    </details>
  );
}
