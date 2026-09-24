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
  it('creates application tables and can be rerun without changing them', async () => {
    const client = database();
    expect(await applyMigrations(client)).toBe(5);
    const before = await schemaFingerprint(client);
    expect(new Set(before.columns.map((row) => row.table_name)).size).toBe(29);
    expect(await applyMigrations(client)).toBe(0);
    expect(await schemaFingerprint(client)).toEqual(before);
  });
  it('refuses an existing database without migration history without changing its data', async () => {
    const client = database();
    await client.exec(
      "CREATE TABLE existing (value text); INSERT INTO existing VALUES ('keep me')",
    );
    await expect(applyMigrations(client)).rejects.toThrow(
      'without migration history',
    );
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
  it('explicitly rebuilds disposable existing schemas and records all migrations', async () => {
    const client = database();
    await client.exec(
      "CREATE TABLE obsolete (value text); INSERT INTO obsolete VALUES ('discard')",
    );
    expect(await applyMigrations(client, { reset: true })).toBe(5);
    expect(
      (await client.query("SELECT to_regclass('public.obsolete') AS name"))
        .rows,
    ).toEqual([{ name: null }]);
    expect(
      new Set(
        (await schemaFingerprint(client)).columns.map((row) => row.table_name),
      ).size,
    ).toBe(29);
    expect(await applyMigrations(client)).toBe(0);
    expect(await applyMigrations(client, { reset: true })).toBe(5);
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
