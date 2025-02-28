import { createInsertSchema } from 'drizzle-zod';

import { resourceTable } from '@/lib/db/schema';

export const projectCreateZod = createInsertSchema(resourceTable, {
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
      .min(3, 'Something a little longer'),
}).pick({
  title: true,
  subtitle: true,
  slug: true,
  type: true,
});
