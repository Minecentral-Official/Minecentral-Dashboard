import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';
import pluginGroupVersions from '@/features/resource-plugin/util/version-group.plugin';

export default function ResourceCompatability({
  versionSupport,
}: Pick<TResourcePlugin, 'versionSupport'>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compatibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex w-full flex-row flex-wrap gap-1'>
          {pluginGroupVersions(versionSupport).map((version) => (
            <Badge key={version}>{version}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
