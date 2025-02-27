import { z } from 'zod';
import { projectUpdateZod_Base } from './resource-base.zod';

//Single source of truth and validation for all update schemas
export const projectUpdateZod_Action = projectUpdateZod_Base.extend({
  //used for /resources/[slug]/[tabName] routing when updating project data
  urlTab: z.enum(["description", "tags", "versions", "links"]).optional()
});
