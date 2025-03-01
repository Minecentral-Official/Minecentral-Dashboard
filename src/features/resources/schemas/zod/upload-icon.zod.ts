import { z } from 'zod';

export const projectUploadResourceZod = z.object({ id: z.string() });
