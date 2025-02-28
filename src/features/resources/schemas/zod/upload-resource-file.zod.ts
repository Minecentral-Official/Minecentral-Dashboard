import { projectDataZod_Base } from './project-validation-base.zod';

export const projectUploadResourceFileZod = projectDataZod_Base.pick({
  id: true,
});
