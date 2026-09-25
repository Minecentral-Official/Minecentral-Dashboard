import 'server-only';

import { parseRuntimeConfig } from '@/lib/env/runtime-config';

// eslint-disable-next-line n/no-process-env
export const serverEnv = parseRuntimeConfig(process.env);
