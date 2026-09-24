import { z } from 'zod';

// Explicit public keys only. Never spread process.env into browser configuration.
const publicSchema = z.object({
  NEXT_PUBLIC_FRONTEND_URL: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().optional(),
});
export const clientEnv = publicSchema.parse({
  // eslint-disable-next-line n/no-process-env
  NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || undefined,
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY:
    // eslint-disable-next-line n/no-process-env
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || undefined,
});
