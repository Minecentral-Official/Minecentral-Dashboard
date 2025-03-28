import { createUploadthing } from 'uploadthing/next';
import { z } from 'zod';

export const UploadBuilder = createUploadthing({
  errorFormatter: (err) => {
    return {
      message: err.message,
      zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
    };
  },
});
