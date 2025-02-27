import { projectUpdateGeneralZod } from './update-general.zod';

export const projectCreateZod = projectUpdateGeneralZod.pick(
  {title: true, subtitle: true, slug: true}
);
