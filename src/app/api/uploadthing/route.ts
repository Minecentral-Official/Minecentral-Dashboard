import { createRouteHandler } from 'uploadthing/next';

import { resourceFileRouter } from '@/features/resources/uploadthing/resource-filerouter';

export const { GET, POST } = createRouteHandler({
  router: resourceFileRouter,
});
