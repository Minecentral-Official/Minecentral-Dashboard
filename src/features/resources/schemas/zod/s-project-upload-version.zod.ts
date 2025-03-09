import { z } from 'zod';

import { C_ResourceVersionSupport } from '@/features/resources/config/resource-version-support.config';

export const S_ProjectUploadVersion = z.object({
  id: z.string(),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(50, 'Max characters 50'),
  description: z.string(),
  version: z.string().max(12, 'Max characters 32'),
  compataibleVersions: z.array(z.enum(C_ResourceVersionSupport)),
});
