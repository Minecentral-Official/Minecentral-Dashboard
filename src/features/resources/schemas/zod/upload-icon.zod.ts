import { projectUpdateZod_Base } from './resource-base.zod';

export const projectUploadIconZod = projectUpdateZod_Base.pick({id: true});
