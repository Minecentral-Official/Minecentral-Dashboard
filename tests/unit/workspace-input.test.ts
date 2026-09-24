import { describe, expect, it } from 'vitest';

import {
  workspaceInput,
  workspaceVersions,
} from '@/features/workspaces/schemas/workspace-input';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

describe('workspace input and roles', () => {
  it.each(workspaceVersions)(
    'accepts curated Paper metadata for %s with Java 21 or unknown Java',
    (version) => {
      for (const javaVersion of [21, '', null])
        expect(
          workspaceInput.safeParse({
            name: 'Server',
            platform: 'paper',
            minecraftVersion: version,
            javaVersion,
          }).success,
        ).toBe(true);
    },
  );
  it('rejects unsupported versions/platforms and credentials in a host', () => {
    const input = {
      name: 'Server',
      platform: 'paper',
      minecraftVersion: '1.21.11',
    };
    for (const override of [
      { platform: 'fabric' },
      { minecraftVersion: 'latest' },
      { javaVersion: 17 },
      { connectionHost: 'https://user:password@host' },
      { connectionPort: 70000 },
    ])
      expect(workspaceInput.safeParse({ ...input, ...override }).success).toBe(
        false,
      );
  });
  it('does not turn global role strings into workspace permissions', () => {
    expect(canUseWorkspace('root', 'read')).toBe(false);
    expect(canUseWorkspace(null, 'read')).toBe(false);
    expect(canUseWorkspace('viewer', 'settings')).toBe(false);
    expect(canUseWorkspace('editor', 'content')).toBe(true);
    expect(canUseWorkspace('admin', 'members')).toBe(false);
    expect(canUseWorkspace('owner', 'lifecycle')).toBe(true);
  });
});
