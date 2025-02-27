import { cacheLife, cacheTag } from "@/lib/cache/cache-exports";
import { desc, eq } from "drizzle-orm";
import { resourceTable } from "../schemas/resource.table";
import { db } from "@/lib/db";
import { resourceReleaseTable } from "../schemas/resource-release.table";
import DTOResource_WithReleases from "../dto/plugin.dto";

export async function resourceGetById(resourceId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`resource-id-${resourceId}`);

  const resource = await db.query.resourceTable.findFirst({
    where: eq(resourceTable.id, resourceId),
    with: {
      user: true,
      releases: {
        orderBy: desc(resourceReleaseTable.createdAt),
      },
    },
  });

  if (!resource) return undefined;
  return DTOResource_WithReleases(resource);
}