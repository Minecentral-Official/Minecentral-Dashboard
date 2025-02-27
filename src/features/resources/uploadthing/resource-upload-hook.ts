import * as React from 'react';

import { generateReactHelpers } from '@uploadthing/react';
import { toast } from 'sonner';
import { z } from 'zod';

import { projectUpdateGeneralZod } from '@/features/resources/schemas/zod/update-general.zod';
import { projectUploadIconZod } from '@/features/resources/schemas/zod/upload-icon.zod';
import { ResourceFileRouter } from '@/features/resources/uploadthing/resource-filerouter';

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
  headers?: Record<string, string>;
  onUploadBegin?: (opts: { file: string }) => void;
  onUploadProgress?: (progress: { progress: number }) => void;
  router: keyof ResourceFileRouter;
}

interface UploadedFile {
  key: string; // Unique identifier
  url: string; // Public URL of the uploaded file
  name: string; // Original filename
  size: number; // File size in bytes
  type: string; // MIME type
}

export function useResourceUpload({
  onUploadComplete,
  onUploadError,
  router,
  ...props
}: UseUploadFileProps) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //UPDATE WHEN ADDING NEW FILE ROUTERS WITH INPUTS!
  const acceptableSchemas = z.union([projectUpdateGeneralZod, projectUploadIconZod]);

  async function uploadThing(file: File, customData: z.infer<typeof acceptableSchemas>) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const res = await uploadFiles(router, {
        ...props,
        input: customData,
        files: [file],
        onUploadProgress: ({ progress }) => {
          setProgress(Math.min(progress, 100));
        },
      });

      setUploadedFile(res[0]);

      onUploadComplete?.(res[0]);

      return uploadedFile;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      const message =
        errorMessage.length > 0 ?
          errorMessage
        : 'Something went wrong, please try again later.';

      toast.error(message);

      onUploadError?.(error);
      return null;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadThing,
    uploadingFile,
  };
}

const { uploadFiles } = generateReactHelpers<ResourceFileRouter>();

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });

    return errors.join('\n');
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
