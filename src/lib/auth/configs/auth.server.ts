import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';

import { db } from '@/lib/db';
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from '@/lib/db/schema';
import { serverEnv } from '@/lib/env/server.env';

export const auth = betterAuth({
  baseURL: serverEnv.FRONTEND_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
  }),
  socialProviders: {
    ...(serverEnv.DISCORD_CLIENT_ID && serverEnv.DISCORD_CLIENT_SECRET ?
      {
        discord: {
          clientId: serverEnv.DISCORD_CLIENT_ID,
          clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
          redirectURI: `${serverEnv.FRONTEND_URL}/api/auth/callback/discord`,
        },
      }
    : {}),
    ...(serverEnv.GITHUB_CLIENT_ID && serverEnv.GITHUB_CLIENT_SECRET ?
      {
        github: {
          clientId: serverEnv.GITHUB_CLIENT_ID,
          clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
  },
  account: { accountLinking: { enabled: false } },
  trustedOrigins: [serverEnv.FRONTEND_URL],
  advanced: {
    useSecureCookies: serverEnv.NODE_ENV === 'production',
    disableOriginCheck: false,
    disableCSRFCheck: false,
  },
  plugins: [
    admin({ defaultRole: 'user', adminRoles: ['admin'] }),
    nextCookies(),
  ],
});
