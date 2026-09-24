import { z } from 'zod';

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);
const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);
const flag = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

export const runtimeConfigSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (value) => /^postgres(ql)?:/.test(value),
        'Must be a PostgreSQL URL',
      ),
    BETTER_AUTH_SECRET: z.string().min(32),
    FRONTEND_URL: z.string().url(),
    REVALIDATION_SECRET: z.string().min(32),
    DISCORD_CLIENT_ID: optionalString,
    DISCORD_CLIENT_SECRET: optionalString,
    DISCORD_REDIRECT: optionalUrl,
    GITHUB_CLIENT_ID: optionalString,
    GITHUB_CLIENT_SECRET: optionalString,
    UPLOADTHING_TOKEN: optionalString,
    STRIPE_SECRET_KEY: optionalString,
    STRIPE_WEBHOOK_SECRET_KEY: optionalString,
    HOST_PTERO_API_KEY: optionalString,
    HOST_PTERO_API_URL: optionalUrl,
    HOST_PTERO_SERVER_CREATE: flag,
    GITHUB_ACCESS_TOKEN: optionalString,
    SERVERLIST_MAX_SERVERS_PER_USER: z.coerce
      .number()
      .int()
      .positive()
      .default(5),
    FEATURE_V2_WORKSPACES: flag,
    FEATURE_V2_COMMUNITY: flag,
    FEATURE_V2_AGENT: flag,
  })
  .superRefine((config, context) => {
    for (const provider of ['DISCORD', 'GITHUB'] as const) {
      if (
        Boolean(config[`${provider}_CLIENT_ID`]) !==
        Boolean(config[`${provider}_CLIENT_SECRET`])
      ) {
        context.addIssue({
          code: 'custom',
          path: [`${provider}_CLIENT_SECRET`],
          message: 'Provider ID and secret must be configured together',
        });
      }
    }
    let origin: URL;
    try {
      origin = new URL(config.FRONTEND_URL);
    } catch {
      context.addIssue({
        code: 'custom',
        path: ['FRONTEND_URL'],
        message: 'Must be a valid origin',
      });
      return;
    }
    if (
      origin.username ||
      origin.password ||
      origin.pathname !== '/' ||
      origin.search ||
      origin.hash ||
      !['http:', 'https:'].includes(origin.protocol)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['FRONTEND_URL'],
        message:
          'Must be an HTTP(S) origin without credentials, path, query or fragment',
      });
    }
    if (config.NODE_ENV === 'production' && origin.protocol !== 'https:') {
      context.addIssue({
        code: 'custom',
        path: ['FRONTEND_URL'],
        message: 'Production origin must use HTTPS',
      });
    }
    if (
      config.DISCORD_REDIRECT &&
      config.DISCORD_REDIRECT !== `${origin.origin}/api/auth/callback/discord`
    ) {
      context.addIssue({
        code: 'custom',
        path: ['DISCORD_REDIRECT'],
        message: 'Must match the application Discord callback URL',
      });
    }
    if (
      config.HOST_PTERO_SERVER_CREATE &&
      (!config.HOST_PTERO_API_KEY || !config.HOST_PTERO_API_URL)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['HOST_PTERO_SERVER_CREATE'],
        message: 'Hosting requires an API URL and key',
      });
    }
  });

export function parseRuntimeConfig(input: Record<string, unknown>) {
  const result = runtimeConfigSchema.safeParse(input);
  if (!result.success) {
    // Report field names only: validation errors must never echo secret values.
    const fields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
    ];
    throw new Error(`Invalid server environment: ${fields.join(', ')}`);
  }
  return {
    ...result.data,
    FRONTEND_URL: new URL(result.data.FRONTEND_URL).origin,
  };
}
