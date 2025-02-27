import { projectUpdateZod_Base } from './resource-base.zod';

export const projectUpdateGeneralZod = projectUpdateZod_Base.partial().pick(
  {id: true, title: true, subtitle: true, slug: true}
);
