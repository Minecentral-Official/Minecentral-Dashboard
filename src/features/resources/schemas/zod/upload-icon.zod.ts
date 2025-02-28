import { projectDataZod_Base } from '@/features/resources/schemas/zod/project-validation-base.zod';

export const projectUploadIconZod = projectDataZod_Base.pick({ id: true });
