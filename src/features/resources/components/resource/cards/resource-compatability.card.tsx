import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource-with-releases.type';
import pluginGroupVersions from '@/features/resources/util/version-group.plugin';

export default function ResourceCardCompatability({
  release,
}: Pick<T_DTOResource_WithReleases, 'release'>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compatibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex w-full flex-row flex-wrap gap-1'>
          {release &&
            release.compatibleVersions?.length > 0 &&
            pluginGroupVersions(release.compatibleVersions).map((version) => (
              <Badge key={version}>{version}</Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
