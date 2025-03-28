import { revalidateTag } from 'next/cache';
import { UploadThingError } from 'uploadthing/server';

import serverUpdate from '@/features/serverlist/mutations/update.server';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import { S_ServerUploadIcon } from '@/features/serverlist/schemas/zod/s-server-upload-icon.zod';
import validateSession from '@/lib/auth/helpers/validate-session';
import { UploadBuilder } from '@/lib/uploadthing/upload-builder';

//This is a UploadThing route for uploading icons
export const serverlist_fileRoute_Banner = UploadBuilder({
  'image/jpeg': {
    maxFileSize: '256KB',
    maxFileCount: 1,
    minFileCount: 1,
    additionalProperties: { height: 60, width: 468 },
  },
  'image/png': {
    maxFileSize: '256KB',
    maxFileCount: 1,
    minFileCount: 1,
    additionalProperties: { height: 60, width: 468 },
  },
  'image/webp': {
    maxFileSize: '256KB',
    maxFileCount: 1,
    minFileCount: 1,
    additionalProperties: { height: 60, width: 468 },
  },
})
  //Input takes in schema type data, parses it, will not continue if there is an error here
  .input(S_ServerUploadIcon)
  //Middleware to provide context to the upload, such as the user who is attempting to upload to this route
  .middleware(async ({ input }) => {
    const { user } = await validateSession();
    if ((await serverGetById(input.id))?.author.id !== user.id)
      throw new UploadThingError('You are not the author!');
    return { userId: user.id, ...input };
  })
  //Return back the uploaded files data along with the context from the middleware (response from uploadthing.com)
  .onUploadComplete(async ({ file, metadata }) => {
    await serverUpdate(metadata.id, { iconUrl: file.ufsUrl });
    revalidateTag(`server-id-${metadata.id}`);
    return { data: { url: file.ufsUrl, ...metadata } };
  });
