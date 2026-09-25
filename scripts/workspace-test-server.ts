import { spawn } from 'node:child_process';
import { createHmac, randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { drizzle } from 'drizzle-orm/pglite';

import type { CatalogDatabase } from '../src/features/catalog/services/catalog-service';

import { createCatalogService } from '../src/features/catalog/services/catalog-service';
import * as schema from '../src/lib/db/schema';
import { catalogFixture } from '../tests/fixtures/catalog';
import { applyMigrations } from './migration-utils';

// Test-only ephemeral database + signed fixture sessions. No application auth bypass.
const secret = 'workspace-browser-test-secret-never-use-for-deployments';
const origin = 'http://127.0.0.1:3100';
const database = new PGlite();
await applyMigrations(database);
await mkdir('tests/.auth', { recursive: true });
for (const id of [
  'desktop',
  'mobile',
  'outsider',
  'curator',
  'stack-desktop',
  'stack-mobile',
  'compatibility-desktop',
  'compatibility-mobile',
]) {
  const token = randomUUID();
  await database.query(
    'INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt", role) VALUES ($1, $2, $3, true, now(), now(), $4)',
    [
      id,
      `Test ${id}`,
      `${id}@example.test`,
      id === 'curator' ? 'curator' : 'user',
    ],
  );
  await database.query(
    'INSERT INTO session (id, token, "userId", "expiresAt", "createdAt", "updatedAt") VALUES ($1, $2, $3, now() + interval \'1 day\', now(), now())',
    [randomUUID(), token, id],
  );
  if (id.startsWith('compatibility-'))
    await database.query(
      'UPDATE "user" SET "createdAt" = now() - interval \'30 days\' WHERE id = $1',
      [id],
    );
  const signature = createHmac('sha256', secret).update(token).digest('base64');
  await writeFile(
    `tests/.auth/${id}.json`,
    JSON.stringify({
      cookies: [
        {
          name: 'better-auth.session_token',
          value: encodeURIComponent(`${token}.${signature}`),
          domain: '127.0.0.1',
          path: '/',
          expires: Math.floor(Date.now() / 1000) + 86400,
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    }),
    { mode: 0o600 },
  );
}
const catalog = createCatalogService(
  drizzle(database, {
    schema,
    casing: 'camelCase',
  }) as unknown as CatalogDatabase,
);
await catalog.importSnapshot(catalogFixture());
await catalog.manual('curator', {
  ...catalogFixture().metadata,
  name: 'External Craft',
  platforms: [],
  url: 'https://example.test/external',
  reason: 'Synthetic manual fixture for browser coverage',
});
const compatibilityFixture = catalogFixture();
compatibilityFixture.externalId = 'cedar123';
compatibilityFixture.locator = 'cedar123';
compatibilityFixture.url = 'https://modrinth.com/plugin/cedar-resolver';
compatibilityFixture.metadata.name = 'Cedar Resolver';
compatibilityFixture.metadata.description =
  'Synthetic compatibility browser fixture.';
compatibilityFixture.versions[0].externalId = 'cedar-version1';
compatibilityFixture.versions[0].name = 'Cedar 1.0';
compatibilityFixture.versions[0].versionNumber = '1.0';
compatibilityFixture.versions[0].dependencies = [
  {
    sourceProjectId: 'oak12345',
    sourceVersionId: 'version1',
    name: 'Oak Permissions',
    type: 'required',
    platform: 'paper',
  },
];
const cedarId = await catalog.importSnapshot(compatibilityFixture);
await database.query(
  `INSERT INTO compatibility_evidence (version_id, platform, minecraft_version, kind, result, confidence, provenance, url, observed_at, expires_at, actor_id)
SELECT v.id, 'paper', '1.21.11', 'automated-test', 'incompatible', 'high', 'Synthetic contradictory runtime evidence for browser testing', 'https://example.test/cedar-test', now() - interval '1 day', now() + interval '30 days', 'curator'
FROM catalog_version v JOIN catalog_source s ON v.source_id = s.id WHERE s.project_id = $1`,
  [cedarId],
);
const socket = new PGLiteSocketServer({
  db: database,
  host: '127.0.0.1',
  port: 55432,
});
await socket.start();
const env = { ...process.env };
for (const key of [
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_REDIRECT',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'UPLOADTHING_TOKEN',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET_KEY',
  'HOST_PTERO_API_KEY',
  'HOST_PTERO_API_URL',
  'GITHUB_ACCESS_TOKEN',
  'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
])
  env[key] = '';
Object.assign(env, {
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:55432/postgres',
  DATABASE_POOL_MAX: '1',
  FRONTEND_URL: origin,
  NEXT_PUBLIC_FRONTEND_URL: origin,
  BETTER_AUTH_SECRET: secret,
  REVALIDATION_SECRET:
    'workspace-browser-revalidation-secret-not-for-deployment',
  HOST_PTERO_SERVER_CREATE: 'false',
  SERVERLIST_MAX_SERVERS_PER_USER: '5',
  FEATURE_V2_WORKSPACES: 'true',
  FEATURE_V2_COMMUNITY: 'false',
  FEATURE_V2_AGENT: 'false',
  NEXT_TELEMETRY_DISABLED: '1',
});
const app = spawn(
  'pnpm',
  ['exec', 'next', 'dev', '--hostname', '127.0.0.1', '--port', '3100'],
  { env, stdio: 'inherit' },
);
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  app.kill('SIGTERM');
  await socket.stop();
  await database.close();
  process.exit(0);
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
app.on('exit', () => {
  void stop();
});
