import 'dotenv/config';

import pg from 'pg';

import { applyMigrations } from './migration-utils';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');
if (
  process.env.NODE_ENV === 'production' &&
  process.env.MIGRATION_APPROVED !== 'true'
) {
  throw new Error(
    'Production migration requires MIGRATION_APPROVED=true after backup/review',
  );
}
const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  console.log(`Applied ${await applyMigrations(client)} migration(s)`);
} finally {
  await client.end();
}
