import { projectDataZod_Base } from '@/features/resources/schemas/zod/project-validation-base.zod';

export const projectUpdateGeneralZod = projectDataZod_Base
  .partial()
  .pick({ id: true, title: true, subtitle: true, slug: true });
