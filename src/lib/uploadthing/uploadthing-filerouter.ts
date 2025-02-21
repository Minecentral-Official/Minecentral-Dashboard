import { createUploadthing } from 'uploadthing/next';

import type { FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  editorUploader: f(['image', 'text', 'blob', 'pdf', 'video', 'audio'])
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { file };
    }),
  jarUploader: f({ blob: { maxFileSize: '32MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      return { userId: 'user_id' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
