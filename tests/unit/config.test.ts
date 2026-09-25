import { describe, expect, it } from 'vitest';

import { parseRuntimeConfig } from '@/lib/env/runtime-config';

const valid = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://test:test@localhost/test',
  BETTER_AUTH_SECRET: 'a'.repeat(32),
  REVALIDATION_SECRET: 'b'.repeat(32),
  FRONTEND_URL: 'http://localhost:3000',
};
describe('runtime configuration', () => {
  it('needs no unused provider credentials and defaults features off', () => {
    const config = parseRuntimeConfig(valid);
    expect(config.FEATURE_V2_AGENT).toBe(false);
    expect(config.SERVERLIST_MAX_SERVERS_PER_USER).toBe(5);
  });
  it('fails closed for invalid flags and incomplete OAuth pairs', () => {
    expect(() =>
      parseRuntimeConfig({ ...valid, FEATURE_V2_AGENT: 'yes' }),
    ).toThrow('FEATURE_V2_AGENT');
    expect(() =>
      parseRuntimeConfig({ ...valid, DISCORD_CLIENT_ID: 'id' }),
    ).toThrow('DISCORD_CLIENT_SECRET');
  });
  it('reports field names without echoing secret input', () => {
    expect(() =>
      parseRuntimeConfig({ ...valid, BETTER_AUTH_SECRET: 'sensitive' }),
    ).toThrow('BETTER_AUTH_SECRET');
    try {
      parseRuntimeConfig({ ...valid, DATABASE_URL: 'secret-connection' });
    } catch (error) {
      expect(String(error)).not.toContain('secret-connection');
    }
  });
  it('reports invalid origins safely and normalizes a trailing slash', () => {
    expect(() =>
      parseRuntimeConfig({ ...valid, FRONTEND_URL: 'not-a-url' }),
    ).toThrow('Invalid server environment: FRONTEND_URL');
    expect(
      parseRuntimeConfig({ ...valid, FRONTEND_URL: 'http://localhost:3000/' })
        .FRONTEND_URL,
    ).toBe('http://localhost:3000');
  });
  it('rejects insecure production origins and foreign OAuth callbacks', () => {
    expect(() =>
      parseRuntimeConfig({ ...valid, NODE_ENV: 'production' }),
    ).toThrow('FRONTEND_URL');
    expect(() =>
      parseRuntimeConfig({
        ...valid,
        DISCORD_REDIRECT: 'https://evil.test/callback',
      }),
    ).toThrow('DISCORD_REDIRECT');
  });
});
