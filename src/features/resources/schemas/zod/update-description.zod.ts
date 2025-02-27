import { projectUpdateZod_Base } from './resource-base.zod';

export const projectUpdateDescriptionZod = projectUpdateZod_Base.partial().pick({id: true, description: true});
