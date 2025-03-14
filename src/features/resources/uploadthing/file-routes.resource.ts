import { fileRouterIcon_Resource } from '@/features/resources/uploadthing/file-route-icon.resource';
import { fileRouterResource } from '@/features/resources/uploadthing/file-route.resource';

import type { FileRouter } from 'uploadthing/next';

//List out all available file routes for the resource feature
export const resourceFileRoutes = {
  fileRouterResource,
  fileRouterIcon: fileRouterIcon_Resource,
} satisfies FileRouter;

export type ResourceFileRouter = typeof resourceFileRoutes;
