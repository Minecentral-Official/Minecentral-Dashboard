'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceOverview({
  plugins,
}: {
  plugins: T_DTOResource_WithReleases[];
}) {
  const stats = {
    totalPlugins: plugins.length,
    totalDownloads: plugins.reduce((acc, resource) => {
      return acc + resource.downloads;
    }, 0),
    totalLikes: plugins.reduce((acc, resource) => {
      return acc + resource.likes;
    }, 0),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-2 gap-4 text-center lg:grid-cols-1'>
          <div>
            <dt className='text-sm font-medium text-muted-foreground'>
              Total Resources
            </dt>
            <dd className='text-2xl font-semibold'>{stats.totalPlugins}</dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-muted-foreground'>
              Total Downloads
            </dt>
            <dd className='text-2xl font-semibold'>
              {stats.totalDownloads.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-muted-foreground'>
              Total Likes
            </dt>
            <dd className='text-2xl font-semibold'>
              {stats.totalLikes.toLocaleString()}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
