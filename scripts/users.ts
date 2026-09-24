import 'dotenv/config';

import pg from 'pg';

import { listUsers, makeAdmin } from './user-utils';

const [command, userId, ...extra] = process.argv.slice(2);
if (
  (command !== 'list' && command !== 'admin') ||
  (command === 'list' && userId !== undefined) ||
  (command === 'admin' && !userId?.trim()) ||
  extra.length
) {
  console.error('Usage: pnpm users:list OR pnpm users:admin <user-id>');
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: url });
try {
  await client.connect();
  if (command === 'list') {
    const users = await listUsers(client);
    console.table(users);
    console.log(`${users.length} user(s)`);
  } else {
    console.table([await makeAdmin(client, userId!)]);
    console.log(
      'Admin role assigned. Refresh the app to use the new permissions.',
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'User command failed');
  process.exitCode = 1;
} finally {
  await client.end();
}
