import { z } from 'zod';

import { S_ResourceResponse } from '@/features/resources/schemas/zod/s-resource-api-responses.zod';

export type T_ResourcesResponse = z.infer<typeof S_ResourceResponse>;
