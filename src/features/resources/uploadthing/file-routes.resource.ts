import { resource_fileRoute_icon } from '@/features/resources/uploadthing/file-route-icon.resource';
import { resource_fileRoute_resource } from '@/features/resources/uploadthing/file-route-resource.resource';

import type { FileRouter } from 'uploadthing/next';

//List out all available file routes for the resource feature
export const resource_fileRoutes = {
  resource_resource: resource_fileRoute_resource,
  resource_icon: resource_fileRoute_icon,
} satisfies FileRouter;

export type T_ResourceFileRouter = typeof resource_fileRoutes;
