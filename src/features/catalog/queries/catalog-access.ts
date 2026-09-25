import 'server-only';

import { createCatalogService } from '@/features/catalog/services/catalog-service';
import { db } from '@/lib/db';

export const catalogService = createCatalogService(db);
