import { z } from 'zod';

import { resourceCreateZod } from '@/features/resource-plugin/schemas/zod/create-resource.zod';

export const pluginCreateZod = resourceCreateZod.extend({
  releaseVersion: z.string().min(1, 'Release Version is required'),
  releaseFile: z.instanceof(File, { message: 'Resource file is required' }),
});
