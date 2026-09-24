import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { createCatalogService } from '../src/features/catalog/services/catalog-service';
import { runCatalogWorker } from '../src/features/catalog/services/catalog-worker';
import * as schema from '../src/lib/db/schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const lock = await client.query(
    'SELECT pg_try_advisory_lock(72721403) AS acquired',
  );
  if (!lock.rows[0].acquired) console.log('Catalog worker already running.');
  else {
    const result = await runCatalogWorker(
      createCatalogService(drizzle(client, { schema, casing: 'camelCase' })),
    );
    console.log(result);
    if (result.failed) process.exitCode = 1;
  }
} finally {
  await client.end();
}
