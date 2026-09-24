import 'server-only';

import { createCompatibilityService } from '@/features/workspaces/services/compatibility-service';
import { db } from '@/lib/db';

export const compatibilityService = createCompatibilityService(db);
