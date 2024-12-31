import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@/lib/auth/configs/auth.server';

export const { POST, GET } = toNextJsHandler(auth);
