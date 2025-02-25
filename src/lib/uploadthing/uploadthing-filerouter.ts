import { createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';

import resourceUploadIconAction from '@/features/resources/actions/upload-resource-icon.action';
import resourceGetById from '@/features/resources/queries/resource-by-id.get';
import { pluginUploadToProjectZod } from '@/features/resources/schemas/zod/upload-icon.zod';
import validateSession from '@/lib/auth/helpers/validate-session';
import { detectResourceType } from '@/lib/uploadthing/file-type';

import type { FileRouter } from 'uploadthing/next';

const f = createUploadthing({
  errorFormatter: (err) => {
    return {
      message: err.message,
      zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
    };
  },
});

export const ourFileRouter = {
  editorUploader: f(['image', 'text', 'blob', 'pdf', 'video', 'audio'])
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { file };
    }),
  iconUploader: f({
    'image/jpeg': { maxFileSize: '256KB' },
    'image/png': { maxFileSize: '256KB' },
    'image/webp': { maxFileSize: '256KB' },
  })
    .input(pluginUploadToProjectZod)
    .middleware(async ({ input }) => {
      const { user } = await validateSession();
      if ((await resourceGetById(input.resourceId))?.author.id !== user.id)
        throw new UploadThingError('You are not the author!');
      return { userId: user.id, ...input };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await resourceUploadIconAction(
        metadata.userId,
        metadata.resourceId,
        file.ufsUrl,
      );
      return { file, metadata };
    }),

  resourceUpload: f({
    'application/java-archive': { maxFileSize: '16MB', maxFileCount: 1 },
    'application/zip': { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .input(pluginUploadToProjectZod)
    .middleware(async ({ input }) => {
      const { user } = await validateSession();
      if ((await resourceGetById(input.resourceId))?.author.id !== user.id)
        throw new UploadThingError('You are not the author!');
      return { userId: user.id, ...input };
    })
    .onUploadComplete(async ({ file }) => {
      const resourceType = await detectResourceType(file.ufsUrl, file.type);

      if (!resourceType) {
        throw new Error('Unknown file type');
      }

      console.log(`Uploaded ${file.name}, detected as ${resourceType}`);

      const obj = {
        data: { url: file.ufsUrl, type: resourceType, name: file.name },
      };
      console.log('Sent to client:', obj);
      return obj;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
