import { UploadThingError } from 'uploadthing/server';

import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { S_ProjectUploadOnResource } from '@/features/resources/schemas/zod/s-project-upload-on-resource.zod';
import { resourceTypeDetector } from '@/features/resources/util/resource-type-detector';
import validateSession from '@/lib/auth/helpers/validate-session';
import { uploadBuilder } from '@/lib/uploadthing/upload-builder';

//This is a UploadThing route for uploading resources
export const fileRouterResource = uploadBuilder({
  'application/java-archive': { maxFileSize: '16MB', maxFileCount: 1 },
  'application/zip': { maxFileSize: '16MB', maxFileCount: 1 },
})
  //Input required schema data for this route
  .input(S_ProjectUploadOnResource)
  //Provides context such as the user who attempts to upload to this route
  .middleware(async ({ input }) => {
    const { user } = await validateSession();
    if ((await projectGetById_WithUser(input.id))?.author.id !== user.id)
      throw new UploadThingError('You are not the author!');
    return { userId: user.id, ...input };
  })
  //on valid response from uploadthing
  .onUploadComplete(async ({ file }) => {
    const resourceType = await resourceTypeDetector(file.ufsUrl, file.type);

    if (!resourceType) {
      throw new Error('Unknown file type');
    }

    console.log(`Uploaded ${file.name}, detected as ${resourceType}`);

    const obj = {
      data: { url: file.ufsUrl, type: resourceType, name: file.name },
    };
    console.log('Sent to client:', obj);
    return obj;
  });
