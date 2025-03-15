import { createInsertSchema } from 'drizzle-zod';

import { serverTable } from '@/features/serverlist/schemas/server.table';
import { isSlug } from '@/lib/utils/slugify';

export const S_ServerCreate = createInsertSchema(serverTable, {
  title: (schema) =>
    schema
      .min(5, 'Title must be at least 5 characters')
      .max(50, 'Max characters 50'),
  subtitle: (schema) =>
    schema
      .max(120, `Please provide a brief summary (120 max characters)`)
      .min(3, 'Put some effort in'),
  slug: (schema) =>
    schema
      .max(120, `Please provide a memorizable url slug`)
      .min(3, 'Something a little longer')
      .transform((val) => {
        return val.toLowerCase();
      })
      .refine((val) => isSlug(val), {
        message:
          'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens.',
      }),
}).pick({
  title: true,
  subtitle: true,
  slug: true,
});
