'use server';

import crypto from 'crypto';

import { z } from 'zod';

import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { pluginCreateZod } from '@/features/resource-plugin/schemas/zod/create-plugin.zod';
import { db } from '@/lib/db';
import { pluginReleaseTable } from '@/lib/db/schema';

export default async function resourceCreate({
  title,
  subtitle,
  description,
  tags,
  linkSource,
  linkSupport,
  versionSupport,
  categories,
  discord,
  languages,
  releaseVersion,
  fileUrl,
  userId,
}: Pick<
  z.infer<typeof pluginCreateZod>,
  | 'title'
  | 'subtitle'
  | 'description'
  | 'categories'
  | 'discord'
  | 'languages'
  | 'linkSource'
  | 'linkSupport'
  | 'releaseVersion'
  | 'tags'
  | 'versionSupport'
> & {
  fileUrl: string;
  userId: string;
}) {
  const newResource = await db.transaction(async (tx) => {
    //Insert new plugin info
    const newPlugin = await tx
      .insert(pluginTable)
      .values({
        title,
        subtitle,
        description,
        tags,
        linkSource,
        linkSupport,
        versionSupport,
        categories,
        discord,
        languages,
        userId,
      })
      .returning();

    await tx
      .insert(pluginReleaseTable)
      .values({
        title: 'First Release',
        description: '',
        fileUrl,
        version: releaseVersion,
        pluginId: newPlugin[0].id,
        downloadId: crypto.randomBytes(16).toString('hex'),
      })
      .returning();

    return newPlugin[0];
  });

  return newResource;
}
