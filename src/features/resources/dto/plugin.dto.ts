import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import { T_ResourceDBData_WithReleases } from '@/features/resources/types/t-resource-db-data-with-reeases.type';

export default function DTOResource_WithReleases({
  releases,
  ...rest
}: T_ResourceDBData_WithReleases) {
  return {
    ...DTOResource(rest),
    releases,
    downloads: releases.reduce((a, b) => a + (b.downloads || 0), 0),
    release: {
      ...releases[0],
    },
  };
}
