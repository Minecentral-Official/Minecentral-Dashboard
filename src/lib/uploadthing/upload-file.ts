import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();
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
