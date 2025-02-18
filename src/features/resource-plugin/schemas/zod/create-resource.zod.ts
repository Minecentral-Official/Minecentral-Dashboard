import { createInsertSchema } from 'drizzle-zod';

import { pluginTable } from '@/lib/db/schema';

export const resourceCreateZod = createInsertSchema(pluginTable, {
  title: (schema) =>
    schema
      .min(5, 'Title must be at least 5 characters')
      .max(50, 'Title is too long'),
  subtitle: (schema) =>
    schema.max(120, `Please provide a brief summary (120 max characters)`),
  description: (schema) =>
    schema.min(10, 'Description must be at least 10 characters'),
  //linkSource: (schema) => schema.url(),
  //linkSupport: (schema) => schema.url(),
  // tags: z.array(z.string()),
  // type: z.enum(ResourceType),
});
