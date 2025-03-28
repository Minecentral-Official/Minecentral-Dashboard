import { serverlist_fileRoute_Banner } from '@/features/serverlist/uploadthing/file-route-banner.serverlist';

import type { FileRouter } from 'uploadthing/next';

//List out all available file routes for the resource feature
export const serverlist_fileRoutes = {
  serverlist_banner: serverlist_fileRoute_Banner,
} satisfies FileRouter;

export type T_ServerListFileRouter = typeof serverlist_fileRoutes;
