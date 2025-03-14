import { createInsertSchema } from 'drizzle-zod';

import { isSlug } from '@/lib/utils/slugify';
import { serverTable } from '../server.table';

export const S_ProjectCreate = createInsertSchema(serverTable, {
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
