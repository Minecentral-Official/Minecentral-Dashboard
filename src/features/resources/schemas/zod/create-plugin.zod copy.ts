// import { createInsertSchema } from 'drizzle-zod';
// import { z } from 'zod';

// import { resourceTable } from '@/lib/db/schema';

// export const projectCreateZod = createInsertSchema(resourceTable, {
//   title: (schema) =>
//     schema
//       .min(5, 'Title must be at least 5 characters')
//       .max(50, 'Title is too long'),
//   subtitle: (schema) =>
//     schema.max(120, `Please provide a brief summary (120 max characters)`),
//   description: (schema) =>
//     schema.min(10, 'Description must be at least 10 characters'),
//   linkSource: (schema) => schema.url(),
//   linkSupport: (schema) => schema.url(),
// })
//   .omit({
//     createdAt: true,
//     updatedAt: true,
//     userId: true,
//     iconUrl: true,
//   })
//   .extend({
//     releaseVersion: z.string().min(1, 'Release Version is required'),
//     resourceType: z.enum(['file', 'url']),
//     resourceFile: z.instanceof(File).optional(),
//     resourceUrl: z.string().url().optional(),
//   });
