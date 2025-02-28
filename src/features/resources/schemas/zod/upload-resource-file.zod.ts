import { projectDataZod_Base } from '@/features/resources/schemas/zod/project-validation-base.zod';

export const projectUploadResourceFileZod = projectDataZod_Base.pick({
  id: true,
});
