import 'dotenv/config';

import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';

import {
  ensureJournal,
  migrations,
  schemaDifferences,
  schemaFingerprint,
} from './migration-utils';

const checkOnly = process.argv.includes('--check');
if (!checkOnly && process.env.BASELINE_APPROVED !== 'true')
  throw new Error(
    'Review backup and schema first; set BASELINE_APPROVED=true to record the baseline',
  );
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
const expected = new PGlite();
const baseline = migrations()[0];
await client.connect();
try {
  for (const sql of baseline.sql) await expected.exec(sql);
  await client.query(
    checkOnly ? 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY' : 'BEGIN',
  );
  await client.query("SET LOCAL lock_timeout = '5s'");
  await client.query("SET LOCAL statement_timeout = '60s'");
  if (!checkOnly) await client.query('SELECT pg_advisory_xact_lock(72721401)');
  // Run under the maintenance/write barrier; do not infer safety from row counts.
  const differences = schemaDifferences(
    await schemaFingerprint(expected),
    await schemaFingerprint(client),
  );
  if (differences.length) {
    console.error(
      'Baseline schema differences (definitions and data omitted):',
    );
    for (const difference of differences) console.error(`- ${difference}`);
    throw new Error(
      'Schema differs from the baseline. Reconcile drift; no history was recorded',
    );
  }
  if (checkOnly) {
    await client.query('ROLLBACK');
    console.log(
      'Schema matches the legacy baseline. Check only; no history was recorded.',
    );
  } else {
    await ensureJournal(client);
    const rows = await client.query(
      'SELECT hash FROM drizzle.__drizzle_migrations',
    );
    if (rows.rows.length)
      throw new Error('Database already has migration history');
    await client.query(
      'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)',
      [baseline.hash, baseline.folderMillis],
    );
    await client.query('COMMIT');
    console.log(
      'Verified legacy baseline recorded without changing application rows',
    );
  }
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
  await expected.close();
}
