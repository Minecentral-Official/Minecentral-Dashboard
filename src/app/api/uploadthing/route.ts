import { createRouteHandler } from 'uploadthing/next';

import { resourceFileRoutes } from '@/features/resources/uploadthing/file-routes.resource';

export const { GET, POST } = createRouteHandler({
  router: resourceFileRoutes,
});
