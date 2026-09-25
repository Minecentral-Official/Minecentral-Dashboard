'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';

export default function ConfigMetadataFields({
  choices,
  initial,
}: {
  choices: { id: string; name: string }[];
  initial?: {
    path: string;
    kind: string;
    entryId: string | null;
    profile: string;
  };
}) {
  const [kind, setKind] = useState(initial?.kind ?? 'server');
  return (
    <div className='space-y-4'>
      <label className='block space-y-2 text-sm'>
        File path
        <Input
          name='path'
          required
          maxLength={240}
          defaultValue={initial?.path ?? ''}
          placeholder='plugins/YourPlugin/config.yml'
        />
      </label>
      <label className='block space-y-2 text-sm'>
        Belongs to
        <select
          name='kind'
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className={workspaceSelectClass}
        >
          <option value='server'>Server</option>
          <option value='plugin'>Plugin</option>
          <option value='unlinked'>Unlinked file</option>
        </select>
      </label>
      {kind === 'plugin' ?
        <label className='block space-y-2 text-sm'>
          Plugin
          <select
            name='entryId'
            required
            defaultValue={initial?.entryId ?? ''}
            className={workspaceSelectClass}
          >
            <option value=''>Choose a plugin</option>
            {choices.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      : <input type='hidden' name='entryId' value='' />}
      <label className='block space-y-2 text-sm'>
        Validation
        <select
          name='profile'
          defaultValue={initial?.profile ?? 'syntax'}
          className={workspaceSelectClass}
        >
          <option value='syntax'>YAML syntax only</option>
          <option value='bukkit-basic'>Bukkit settings — basic checks</option>
        </select>
      </label>
      <p className='text-xs text-muted-foreground'>
        Basic checks are advisory and cover a few Bukkit setting types. They do
        not verify every plugin option or server version.
      </p>
    </div>
  );
}
