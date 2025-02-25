'use server';

import { z } from 'zod';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { projectCreateZod } from '@/features/resources/schemas/zod/project-create.zod';
import { db } from '@/lib/db';
import createUUID from '@/lib/utils/create-uuid';

export default async function projectCreate({
  title,
  subtitle,
  slug,
  userId,
}: z.infer<typeof projectCreateZod> & {
  userId: string;
}) {
  const newResource = await db.transaction(async (tx) => {
    //Insert new plugin info
    const newPlugin = await tx
      .insert(resourceTable)
      .values({
        id: createUUID(),
        title,
        subtitle,
        slug,
        userId,
      })
      .returning();

    // await tx
    //   .insert(resourceReleaseTable)
    //   .values({
    //     title: 'First Release',
    //     description: '',
    //     fileUrl,
    //     version: releaseVersion,
    //     pluginId: newPlugin[0].id,
    //     downloadId: crypto.randomBytes(16).toString('hex'),
    //   })
    //   .returning();

    return newPlugin[0];
  });

  return newResource;
}
