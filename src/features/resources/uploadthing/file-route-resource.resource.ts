import { UploadThingError } from 'uploadthing/server';

import projectCreateRelease from '@/features/resources/mutations/create.release';
import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { S_ProjectCreateVersion_Plugin } from '@/features/resources/schemas/zod/s-project-create-version.zod';
import validateSession from '@/lib/auth/helpers/validate-session';
import { UploadBuilder } from '@/lib/uploadthing/upload-builder';

//This is a UploadThing route for uploading resources
export const resource_fileRoute_resource = UploadBuilder({
  'application/java-archive': {
    maxFileSize: '16MB',
    maxFileCount: 1,
    minFileCount: 1,
  },
  'application/zip': { maxFileSize: '16MB', maxFileCount: 1, minFileCount: 1 },
})
  //Input required schema data for this route
  .input(S_ProjectCreateVersion_Plugin)
  //Provides context such as the user who attempts to upload to this route
  .middleware(async ({ input }) => {
    const { user } = await validateSession();
    if ((await projectGetById_WithUser(input.id))?.author.id !== user.id)
      throw new UploadThingError('You are not the author!');
    return { userId: user.id, ...input };
  })
  //on valid response from uploadthing
  .onUploadComplete(async ({ file, metadata }) => {
    // const resourceType = await resourceTypeDetector(file.ufsUrl, file.type);

    // if (!resourceType) {
    //   throw new Error('Unknown file type');
    // }

    // console.log(`Uploaded ${file.name}, detected as ${resourceType}`);
    const release = await projectCreateRelease({
      pluginId: metadata.id,
      fileUrl: file.ufsUrl,
      ...metadata,
    });
    const obj = {
      data: {
        url: file.ufsUrl,
        name: file.name,
        data: JSON.stringify(release),
      },
    };
    // console.log('Sent to client:', obj);
    return obj;
  });
