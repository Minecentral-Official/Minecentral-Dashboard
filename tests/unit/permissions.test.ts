import { describe, expect, it } from 'vitest';

import {
  assertOwnedRecord,
  hasPermission,
} from '@/lib/auth/helpers/permissions';
import { safeReturnPath } from '@/lib/auth/helpers/safe-return-path';

describe('authorization policy', () => {
  it('separates curator, moderator and admin capabilities', () => {
    expect(hasPermission('curator', 'catalog:curate')).toBe(true);
    expect(hasPermission('curator', 'tickets:support')).toBe(false);
    expect(hasPermission('moderator', 'resources:moderate')).toBe(true);
    expect(hasPermission('moderator', 'users:manage')).toBe(false);
    expect(hasPermission('admin', 'users:manage')).toBe(true);
    for (const role of [null, undefined, 'root', 'user,admin'])
      expect(hasPermission(role, 'admin:access')).toBe(false);
  });
  it('requires ownership unless the operation explicitly allows a staff permission', () => {
    expect(() =>
      assertOwnedRecord({ id: 'other', role: 'admin' }, 'owner'),
    ).toThrow('Forbidden');
    expect(() =>
      assertOwnedRecord(
        { id: 'other', role: 'moderator' },
        'owner',
        'tickets:support',
      ),
    ).not.toThrow();
  });
});
describe('OAuth return destinations', () => {
  it.each([
    'https://evil.test',
    '//evil.test',
    '/%2fexample.test',
    '/\\evil.test',
    '/sign-in',
    '/api/auth/callback/discord',
    '/%0aevil',
    '/%',
  ])('rejects %s', (value) => {
    expect(safeReturnPath(value)).toBe('/dashboard');
  });
  it('retains a safe internal task link', () =>
    expect(safeReturnPath('/dashboard/tickets/123?tab=messages')).toBe(
      '/dashboard/tickets/123?tab=messages',
    ));
});
