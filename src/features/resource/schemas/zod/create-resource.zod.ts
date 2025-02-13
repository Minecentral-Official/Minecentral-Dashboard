import { createInsertSchema } from 'drizzle-zod';

import { resourceTable } from '@/lib/db/schema';

export const resourceCreateZod = createInsertSchema(resourceTable, {
  title: (schema) =>
    schema
      .min(5, 'Title must be at least 5 characters')
      .max(50, 'Title is too long'),
  subtitle: (schema) =>
    schema.max(120, `Please provide a brief summary (120 max characters)`),
  description: (schema) =>
    schema.min(10, 'Description must be at least 10 characters'),
  linkSource: (schema) => schema.url(),
  linkSupport: (schema) => schema.url(),
  // type: z.enum(ResourceType),
}).omit({ createdAt: true, updatedAt: true, userId: true, releaseId: true });
