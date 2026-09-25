import { readMigrationFiles } from 'drizzle-orm/migrator';

export interface SqlClient {
  query(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: Record<string, unknown>[] }>;
}
export const migrations = () =>
  readMigrationFiles({ migrationsFolder: './drizzle' });

export async function schemaFingerprint(client: SqlClient) {
  const columns =
    await client.query(`SELECT table_name, column_name, ordinal_position,
    data_type, udt_name, is_nullable, column_default, is_identity, identity_generation
    FROM information_schema.columns WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position`);
  const constraints =
    await client.query(`SELECT c.relname AS table_name, con.conname AS name,
    pg_get_constraintdef(con.oid) AS definition FROM pg_constraint con
    JOIN pg_class c ON c.oid = con.conrelid JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' ORDER BY c.relname, con.conname`);
  const indexes =
    await client.query(`SELECT tablename, indexname, indexdef FROM pg_indexes
    WHERE schemaname = 'public' ORDER BY tablename, indexname`);
  return {
    columns: columns.rows,
    constraints: constraints.rows,
    indexes: indexes.rows,
  };
}

export async function ensureJournal(client: SqlClient) {
  await client.query('CREATE SCHEMA IF NOT EXISTS drizzle');
  await client.query(
    'CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id serial PRIMARY KEY, hash text NOT NULL, created_at bigint)',
  );
}
export async function applyMigrations(client: SqlClient) {
  await client.query('BEGIN');
  try {
    await client.query("SET LOCAL lock_timeout = '5s'");
    await client.query("SET LOCAL statement_timeout = '60s'");
    await client.query('SELECT pg_advisory_xact_lock(72721401)');
    const hasJournal = await client.query(
      "SELECT to_regclass('drizzle.__drizzle_migrations') AS name",
    );
    if (!hasJournal.rows[0]?.name) {
      const existing = await client.query(
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
      );
      if (existing.rows.length)
        throw new Error(
          'Existing unbaselined database: review schema drift and run db:baseline first',
        );
    }
    await ensureJournal(client);
    const applied = (
      await client.query(
        'SELECT hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at',
      )
    ).rows;
    const files = migrations();
    if (
      applied.length > files.length ||
      applied.some(
        (row, index) =>
          row.hash !== files[index].hash ||
          Number(row.created_at) !== files[index].folderMillis,
      )
    ) {
      throw new Error(
        'Migration history mismatch: applied migrations must be an unchanged prefix',
      );
    }
    for (const migration of files.slice(applied.length)) {
      for (const sql of migration.sql) await client.query(sql);
      await client.query(
        'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)',
        [migration.hash, migration.folderMillis],
      );
    }
    await client.query('COMMIT');
    return files.length - applied.length;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}
