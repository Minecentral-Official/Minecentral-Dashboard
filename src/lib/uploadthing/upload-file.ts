import { UTApi } from 'uploadthing/server';

import { serverEnv } from '@/lib/env/server.env';

const utapi = new UTApi({
  token: serverEnv.UPLOADTHING_TOKEN,
});
export async function uploadThing_File(file: File) {
  try {
    // Upload file to UploadThing
    const { data, error } = await utapi.uploadFiles(file);

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}
