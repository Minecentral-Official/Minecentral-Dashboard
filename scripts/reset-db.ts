import 'dotenv/config';

import pg from 'pg';

import { applyMigrations } from './migration-utils';

if (!process.argv.includes('--confirm'))
  throw new Error(
    'This erases the public schema and migration history. Run pnpm db:reset --confirm only for a disposable database.',
  );
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  console.log(
    `Database rebuilt; applied ${await applyMigrations(client, { reset: true })} migration(s)`,
  );
} finally {
  await client.end();
}
