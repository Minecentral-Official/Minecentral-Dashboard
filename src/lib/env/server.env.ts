import { createEnv } from '@t3-oss/env-nextjs';

import 'server-only';

import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
  },
  // eslint-disable-next-line n/no-process-env
  experimental__runtimeEnv: process.env,
});
