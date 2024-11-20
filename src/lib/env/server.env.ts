import { createEnv } from '@t3-oss/env-nextjs';

import 'server-only';

import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET_KEY: z.string(),
  },
  // eslint-disable-next-line n/no-process-env
  experimental__runtimeEnv: process.env,
  isServer: typeof window === 'undefined',
});
