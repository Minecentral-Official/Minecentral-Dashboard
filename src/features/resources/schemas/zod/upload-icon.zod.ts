import { projectDataZod_Base } from './project-validation-base.zod';

export const projectUploadIconZod = projectDataZod_Base.pick({ id: true });
