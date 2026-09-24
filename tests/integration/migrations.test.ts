import { PGlite } from '@electric-sql/pglite';
import { afterEach, describe, expect, it } from 'vitest';

import {
  applyMigrations,
  schemaFingerprint,
} from '../../scripts/migration-utils';

const clients: PGlite[] = [];
function database() {
  const client = new PGlite();
  clients.push(client);
  return client;
}
afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.close()));
});

describe('migration safety against PostgreSQL', () => {
  it('creates legacy and workspace tables and can be rerun without changing them', async () => {
    const client = database();
    expect(await applyMigrations(client)).toBe(2);
    const before = await schemaFingerprint(client);
    expect(new Set(before.columns.map((row) => row.table_name)).size).toBe(17);
    expect(await applyMigrations(client)).toBe(0);
    expect(await schemaFingerprint(client)).toEqual(before);
  });
  it('refuses an existing unbaselined database without changing its data', async () => {
    const client = database();
    await client.exec(
      "CREATE TABLE existing (value text); INSERT INTO existing VALUES ('keep me')",
    );
    await expect(applyMigrations(client)).rejects.toThrow('unbaselined');
    expect((await client.query('SELECT * FROM existing')).rows).toEqual([
      { value: 'keep me' },
    ]);
    expect(
      (
        await client.query(
          "SELECT to_regclass('drizzle.__drizzle_migrations') AS name",
        )
      ).rows,
    ).toEqual([{ name: null }]);
  });
  it('rejects changed migration history', async () => {
    const client = database();
    await applyMigrations(client);
    await client.query(
      "UPDATE drizzle.__drizzle_migrations SET hash = 'tampered'",
    );
    await expect(applyMigrations(client)).rejects.toThrow('history mismatch');
  });
});
