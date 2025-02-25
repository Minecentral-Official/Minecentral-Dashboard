import { T_ResourceDBData } from '@/features/resources/types/t-resource-db-data.type';
import { resourceReleaseTable } from '@/lib/db/schema';

export type T_ResourceDBData_WithReleases = T_ResourceDBData & {
  releases: (typeof resourceReleaseTable.$inferSelect)[];
};
