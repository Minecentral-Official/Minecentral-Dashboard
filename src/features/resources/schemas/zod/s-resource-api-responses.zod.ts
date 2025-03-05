import { z } from 'zod';

import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export const S_ResourceResponse = z.object({
  resources: z.array(z.custom<T_DTOResource>()),
  totalPages: z.number(),
});
