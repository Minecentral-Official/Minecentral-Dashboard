import { resource } from '@/features/resource/schemas/resource.table';
import { db } from '@/lib/db';

export default async function ResourceCreate(
  values: typeof resource.$inferInsert,
) {
  return await db.insert(resource).values(values).returning();
}
