import { projectDataZod_Base } from '@/features/resources/schemas/zod/project-validation-base.zod';

export const projectUpdateDescriptionZod = projectDataZod_Base
  .partial()
  .pick({ id: true, description: true });
