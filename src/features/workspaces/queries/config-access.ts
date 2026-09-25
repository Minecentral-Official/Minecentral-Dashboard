import 'server-only';

import { createConfigService } from '@/features/workspaces/services/config-service';
import { db } from '@/lib/db';

export const configService = createConfigService(db);
