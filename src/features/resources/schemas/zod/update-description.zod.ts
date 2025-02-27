import { projectUpdateZod_Action } from './resource-actions.zod';

export const projectUpdateDescriptionZod = projectUpdateZod_Action.partial()
    .pick({id: true, description: true, urlTab: true});
