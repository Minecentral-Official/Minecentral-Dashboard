import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';
import { z } from 'zod';

// eslint-disable-next-line n/no-process-env
const url = z.string().url().parse(process.env.DATABASE_URL);
export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
