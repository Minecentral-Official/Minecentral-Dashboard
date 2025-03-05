import { createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';

import projectUpdate from '@/features/resources/mutations/update.project';
import resourceGetById_WithUser from '@/features/resources/queries/project-by-id-with-user.get';
import { projectUploadResourceZod } from '@/features/resources/schemas/zod/upload-icon.zod';
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

export const resourceFileRouter = {
  iconUploader: f({
    'image/jpeg': { maxFileSize: '256KB' },
    'image/png': { maxFileSize: '256KB' },
    'image/webp': { maxFileSize: '256KB' },
  })
    .input(projectUploadResourceZod)
    .middleware(async ({ input }) => {
      const { user } = await validateSession();
      if ((await resourceGetById_WithUser(input.id))?.author.id !== user.id)
        throw new UploadThingError('You are not the author!');
      return { userId: user.id, ...input };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await projectUpdate(metadata.id, { iconUrl: file.ufsUrl });
      return { data: { url: file.ufsUrl, ...metadata } };
    }),

  resourceUpload: f({
    'application/java-archive': { maxFileSize: '16MB', maxFileCount: 1 },
    'application/zip': { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .input(projectUploadResourceZod)
    .middleware(async ({ input }) => {
      const { user } = await validateSession();
      if ((await resourceGetById_WithUser(input.id))?.author.id !== user.id)
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

export type ResourceFileRouter = typeof resourceFileRouter;
