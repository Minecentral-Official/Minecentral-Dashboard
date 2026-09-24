import 'server-only';

import { createStackService } from '@/features/workspaces/services/stack-service';
import { db } from '@/lib/db';

export const stackService = createStackService(db);
