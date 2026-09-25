import 'server-only';

import { createVisualSchemaService } from '@/features/workspaces/services/visual-schema-service';
import { db } from '@/lib/db';

export const visualSchemas = createVisualSchemaService(db);
