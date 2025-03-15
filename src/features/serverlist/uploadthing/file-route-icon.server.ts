// import { UploadThingError } from 'uploadthing/server';

// import projectUpdate from '@/features/resources/mutations/update.project';
// import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
// import validateSession from '@/lib/auth/helpers/validate-session';
// import { uploadBuilder } from '@/lib/uploadthing/upload-builder';

// import { S_ServerUploadIcon } from '../schemas/zod/s-server-upload-icon.zod';

// //This is a UploadThing route for uploading icons
// export const fileRouterIcon_Server = uploadBuilder({
//   'image/jpeg': { maxFileSize: '256KB' },
//   'image/png': { maxFileSize: '256KB' },
//   'image/webp': { maxFileSize: '256KB' },
// })
//   //Input takes in schema type data, parses it, will not continue if there is an error here
//   .input(S_ServerUploadIcon)
//   //Middleware to provide context to the upload, such as the user who is attempting to upload to this route
//   .middleware(async ({ input }) => {
//     const { user } = await validateSession();
//     if ((await projectGetById_WithUser(input.id))?.author.id !== user.id)
//       throw new UploadThingError('You are not the author!');
//     return { userId: user.id, ...input };
//   })
//   //Return back the uploaded files data along with the context from the middleware (response from uploadthing.com)
//   .onUploadComplete(async ({ file, metadata }) => {
//     await projectUpdate(metadata.id, { iconUrl: file.ufsUrl });
//     return { data: { url: file.ufsUrl, ...metadata } };
//   });
