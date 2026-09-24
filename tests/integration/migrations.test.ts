import { PGlite } from '@electric-sql/pglite';
import { afterEach, describe, expect, it } from 'vitest';

import {
  applyMigrations,
  schemaDifferences,
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
  it('identifies schema drift without exposing default literals or changing records', async () => {
    const client = database();
    await client.exec(
      "CREATE TABLE sample (id integer PRIMARY KEY, note text DEFAULT 'private-value'); INSERT INTO sample (id) VALUES (1)",
    );
    const expected = await schemaFingerprint(client);
    expect(schemaDifferences(expected, expected)).toEqual([]);
    await client.exec(
      "ALTER TABLE sample ALTER COLUMN note SET DEFAULT 'another-private-value'; ALTER TABLE sample ADD COLUMN extra text; CREATE INDEX sample_note_idx ON sample (note)",
    );
    const differences = schemaDifferences(
      expected,
      await schemaFingerprint(client),
    );
    expect(differences).toContain(
      'columns ["sample","note"]: differs in column_default',
    );
    expect(differences).toContain(
      'columns ["sample","extra"]: extra in database',
    );
    expect(differences).toContain(
      'indexes ["sample","sample_note_idx"]: extra in database',
    );
    expect(differences.join(' ')).not.toContain('private-value');
    expect((await client.query('SELECT note FROM sample')).rows).toEqual([
      { note: 'private-value' },
    ]);
    await client.exec('ALTER TABLE sample DROP COLUMN note');
    expect(
      schemaDifferences(expected, await schemaFingerprint(client)),
    ).toContain('columns ["sample","note"]: missing from database');
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
