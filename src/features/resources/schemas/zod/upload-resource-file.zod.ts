import { projectUpdateZod_Base } from './resource-base.zod';

export const projectUploadResourceFileZod = projectUpdateZod_Base.pick({id: true});
