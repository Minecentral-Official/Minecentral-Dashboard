import { Input } from '@/components/ui/input';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';

export default function StackVersionFields({
  releases,
  current,
}: {
  releases: {
    version: { id: string; name: string; available: number };
    provider: string;
    support: string;
  }[];
  current?: {
    versionId: string | null;
    manualVersion: string | null;
    versionSource: string;
    installedName?: string | null;
  };
}) {
  return (
    <div className='space-y-4'>
      <label className='block space-y-2 text-sm'>
        Installed version
        <select
          name='version'
          className={workspaceSelectClass}
          defaultValue={
            current?.versionId ?? current?.versionSource ?? 'unknown'
          }
        >
          <option value='unknown'>Unknown / clear installed version</option>
          <option value='manual'>Enter a version manually</option>
          {current?.versionId &&
            !releases.some((r) => r.version.id === current.versionId) && (
              <option value={current.versionId}>
                {current.installedName ?? 'Recorded release'} (outside current
                filter)
              </option>
            )}
          {releases.map(({ version, provider, support }) => (
            <option key={version.id} value={version.id}>
              {version.name} · {provider} ·{' '}
              {version.available === 0 ?
                'unavailable'
              : support === 'declared' ?
                'declared support'
              : support === 'unsupported' ?
                'WARNING: unsupported runtime'
              : 'support unknown'}
            </option>
          ))}
        </select>
      </label>
      <label className='block space-y-2 text-sm'>
        Manual version
        <Input
          name='manualVersion'
          maxLength={150}
          defaultValue={current?.manualVersion ?? ''}
          placeholder='e.g. 5.4.0-custom (select manual above)'
        />
      </label>
      <p className='text-xs text-muted-foreground'>
        Unsupported or unavailable releases may still be recorded. They are not
        verified to work on this runtime. Selecting unknown clears the version,
        not the plugin.
      </p>
    </div>
  );
}
