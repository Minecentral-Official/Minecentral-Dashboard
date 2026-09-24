import { createRouteHandler } from 'uploadthing/next';

import { resource_fileRoutes } from '@/features/resources/uploadthing/file-routes.resource';
import { serverlist_fileRoutes } from '@/features/serverlist/uploadthing/file-routes.serverlist';

export const { GET, POST } = createRouteHandler({
  router: { ...resource_fileRoutes, ...serverlist_fileRoutes },
});
