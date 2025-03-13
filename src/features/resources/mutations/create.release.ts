'use server';

import { revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { resourceReleaseTable } from '@/lib/db/schema';

export default async function projectCreateRelease({
  title,
  description,
  compatibleVersions,
  fileUrl,
  version,
  pluginId,
  loaders,
}: Pick<
  typeof resourceReleaseTable.$inferInsert,
  | 'compatibleVersions'
  | 'description'
  | 'fileUrl'
  | 'title'
  | 'version'
  | 'pluginId'
  | 'loaders'
>) {
  const newRelease = await db.transaction(async (tx) => {
    //Insert new resource release
    const newRelease = await tx
      .insert(resourceReleaseTable)
      .values({
        id: crypto.randomUUID(),
        pluginId,
        title,
        compatibleVersions,
        description,
        fileUrl,
        version,
        loaders,
      })
      .returning();

    return newRelease[0];
  });

  revalidateTag(`resource-id-${pluginId}`);
  return newRelease;
}
