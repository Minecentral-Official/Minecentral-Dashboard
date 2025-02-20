import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from '@/lib/uploadthing/uploadthing-filerouter';

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
