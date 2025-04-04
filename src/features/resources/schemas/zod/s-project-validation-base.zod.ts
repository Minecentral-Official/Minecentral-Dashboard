import { createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { resourceTable } from '@/lib/db/schema';

//Single source of truth and validation for all update schemas
export const S_ProjectDataBase = createUpdateSchema(resourceTable, {
  id: z.string(),
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
  description: (schema) =>
    schema.min(100, 'Please make an effort to make a good description'),
});
