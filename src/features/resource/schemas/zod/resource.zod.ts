import { createInsertSchema } from 'drizzle-zod';

import { resource } from '@/lib/db/schema';

export const resourceCreateZod = createInsertSchema(resource, {
  title: (schema) =>
    schema
      .min(5, 'Title must be at least 5 characters')
      .max(50, 'Title is too long'),
  description: (schema) =>
    schema.min(10, 'Description must be at least 10 characters'),
  // type: z.enum(ResourceType),
}).omit({ createdAt: true, updatedAt: true, userId: true });
