import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
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
    discord: {
      clientId: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      redirectURI: serverEnv.DISCORD_REDIRECT,
    },
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    },
  },
  trustedOrigins: ['https://minecentral.net'],
  plugins: [admin()],
});
