import { spawnSync } from 'node:child_process';

// Isolate checks from any developer .env and external provider credentials.
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
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://fixture:fixture@127.0.0.1:1/minecentral_test',
  BETTER_AUTH_SECRET: 'test-only-auth-secret-never-use-in-production-0001',
  REVALIDATION_SECRET: 'test-only-revalidation-secret-never-use-00000001',
  FRONTEND_URL: 'https://example.test',
  NEXT_PUBLIC_FRONTEND_URL: 'https://example.test',
  HOST_PTERO_SERVER_CREATE: 'false',
  SERVERLIST_MAX_SERVERS_PER_USER: '5',
  FEATURE_V2_WORKSPACES: 'false',
  FEATURE_V2_COMMUNITY: 'false',
  FEATURE_V2_AGENT: 'false',
});
const [command, ...args] = process.argv.slice(2);
if (!command) throw new Error('Provide a command');
const result = spawnSync(command, args, { env, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
