import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { pluginTable } from '@/lib/db/schema';

export const pluginCreateZod = createInsertSchema(pluginTable, {
  title: (schema) =>
    schema
      .min(5, 'Title must be at least 5 characters')
      .max(50, 'Title is too long'),
  subtitle: (schema) =>
    schema.max(120, `Please provide a brief summary (120 max characters)`),
  description: (schema) =>
    schema.min(10, 'Description must be at least 10 characters'),
  // tags: z.array(z.string()),
})
  .omit({
    createdAt: true,
    updatedAt: true,
    userId: true,
    downloads: true,
  })
  .extend({
    releaseVersion: z.string().min(1, 'Release Version is required'),
    releaseFile: z.instanceof(File, { message: 'Resource file is required' }),
  });
