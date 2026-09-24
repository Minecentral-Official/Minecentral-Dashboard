import {
  createSourceClient,
  SourceError,
} from '@/features/catalog/services/source-client';

import type { createCatalogService } from '@/features/catalog/services/catalog-service';

export async function runCatalogWorker(
  service: ReturnType<typeof createCatalogService>,
  client = createSourceClient(),
  limit = 10,
) {
  await service.schedule();
  let completed = 0;
  let failed = 0;
  for (let i = 0; i < limit; i++) {
    const job = await service.claim();
    if (!job) break;
    try {
      const snapshot = await client.snapshot(job.provider, job.locator);
      await service.importSnapshot(snapshot);
      await service.complete(job.id);
      completed++;
    } catch (error) {
      const known = error instanceof SourceError;
      await service.fail(
        job,
        known ?
          error.message
        : 'Import failed validation or persistence; inspect source metadata and database health.',
        known ? error.status : 0,
        known ? error.retryAfter : 0,
      );
      failed++;
    }
  }
  return { completed, failed };
}
