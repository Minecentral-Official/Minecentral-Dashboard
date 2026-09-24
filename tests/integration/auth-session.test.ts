import { PGlite } from '@electric-sql/pglite';
import { betterAuth } from 'better-auth';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

import { auth as productionAuth } from '@/lib/auth/configs/auth.server';
import * as database from '@/lib/db';

import { applyMigrations } from '../../scripts/migration-utils';

vi.mock('@/lib/db', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const schema = await import('@/lib/db/schema');
  const client = new PGlite();
  return { db: drizzle(client, { schema, casing: 'camelCase' }), client };
});
vi.mock('@/lib/env/server.env', () => ({
  serverEnv: {
    FRONTEND_URL: 'http://localhost:3000',
    NODE_ENV: 'test',
    BETTER_AUTH_SECRET: 'isolated-auth-test-secret-at-least-32-characters',
    DISCORD_CLIENT_ID: 'discord-test-client',
    DISCORD_CLIENT_SECRET: 'discord-test-secret',
  },
}));

const { client } = database as unknown as { client: PGlite };
// Password signup is a fixture factory only. Production remains OAuth-only.
const auth = betterAuth({
  ...productionAuth.options,
  emailAndPassword: { enabled: true },
});
beforeAll(async () => {
  await applyMigrations(client);
});
afterAll(async () => {
  await client.close();
});
it('persists a session readable by server and browser endpoints, then revokes it', async () => {
  const response = await auth.api.signUpEmail({
    body: {
      name: 'Fixture',
      email: 'fixture@example.test',
      password: 'fixture-password-for-test',
    },
    asResponse: true,
  });
  expect(response.status).toBe(200);
  const cookie = response.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ');
  expect(cookie).toContain('better-auth.session_token=');
  const headers = new Headers({ cookie, origin: 'http://localhost:3000' });
  const session = await auth.api.getSession({ headers });
  expect(session?.user.name).toBe('Fixture');
  expect(session?.user.role).toBe('user');
  const browser = await auth.handler(
    new Request('http://localhost:3000/api/auth/get-session', { headers }),
  );
  expect((await browser.json()).user.id).toBe(session?.user.id);
  await auth.api.signOut({ headers });
  expect(await auth.api.getSession({ headers })).toBeNull();
});
it('starts Discord OAuth with the configured callback and rejects external return URLs', async () => {
  const result = await productionAuth.api.signInSocial({
    body: {
      provider: 'discord',
      callbackURL: '/dashboard',
      disableRedirect: true,
    },
  });
  const url = new URL(result.url!);
  expect(url.hostname).toBe('discord.com');
  expect(url.searchParams.get('redirect_uri')).toBe(
    'http://localhost:3000/api/auth/callback/discord',
  );
  const rejected = await productionAuth.handler(
    new Request('http://localhost:3000/api/auth/sign-in/social', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        provider: 'discord',
        callbackURL: 'https://attacker.example/steal',
      }),
    }),
  );
  expect(rejected.status).toBe(403);
});
