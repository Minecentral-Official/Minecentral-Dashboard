import { PGlite } from '@electric-sql/pglite';
import { expect, it } from 'vitest';

import { applyMigrations } from '../../scripts/migration-utils';
import { listUsers, makeAdmin } from '../../scripts/user-utils';

it('lists safe account fields and promotes only the exact existing user', async () => {
  const client = new PGlite();
  try {
    await applyMigrations(client);
    await client.query(`
      INSERT INTO public."user"
        (id, name, email, "emailVerified", "createdAt", "updatedAt", role, banned)
      VALUES
        ('one', 'One', 'one@example.test', true, NOW(), '2020-01-01', 'user', false),
        ('two', 'Two', 'two@example.test', true, NOW(), '2020-01-01', 'curator', true)
    `);
    const before = await listUsers(client);
    expect(before).toHaveLength(2);
    expect(Object.keys(before[0]).sort()).toEqual([
      'banned',
      'email',
      'id',
      'name',
      'role',
    ]);
    await expect(makeAdmin(client, "one' OR true --")).rejects.toThrow(
      'User not found',
    );
    await expect(makeAdmin(client, '')).rejects.toThrow(
      'A user ID is required',
    );
    expect(await listUsers(client)).toEqual(before);
    expect(await makeAdmin(client, 'two')).toMatchObject({
      id: 'two',
      role: 'admin',
      banned: true,
    });
    expect((await listUsers(client))[0]).toEqual(before[0]);
    expect(
      (
        await client.query(
          `SELECT "updatedAt" > '2020-01-01'::timestamp AS changed FROM public."user" WHERE id = 'two'`,
        )
      ).rows,
    ).toEqual([{ changed: true }]);
    expect(await makeAdmin(client, 'two')).toMatchObject({ role: 'admin' });
  } finally {
    await client.close();
  }
});
