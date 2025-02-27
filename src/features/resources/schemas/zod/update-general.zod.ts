import { projectUpdateZod_Action } from './resource-actions.zod';

export const projectUpdateGeneralZod = projectUpdateZod_Action.partial().pick(
  {id: true, title: true, subtitle: true, slug: true, urlTab: true}
);
