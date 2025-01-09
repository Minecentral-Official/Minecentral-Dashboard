import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    NODE_ENV: z.enum(['production', 'developement']),
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET_KEY: z.string(),
    HOST_PTERO_API_KEY: z.string(),
    HOST_PTERO_API_URL: z.string().url(),
    HOST_PTERO_SERVER_CREATE: z.string().transform((value) => value === 'true'),
  },
  // eslint-disable-next-line n/no-process-env
  experimental__runtimeEnv: process.env,
  isServer: typeof window === 'undefined',
  onValidationError: (err) => {
    console.log(err);
  },
});
