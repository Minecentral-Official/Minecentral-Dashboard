'use client';

import { DownloadIcon, LayoutListIcon, ThumbsUpIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import compactNumber from '@/lib/utils/compact-number';

export default function ResourceOverview({
  plugins,
}: {
  plugins: T_DTOResource[];
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
            <dd className='flex flex-row items-center justify-center text-2xl font-semibold'>
              <LayoutListIcon className='mr-1 h-5 w-5' />
              {stats.totalPlugins}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-muted-foreground'>
              Total Downloads
            </dt>
            <dd className='flex flex-row items-center justify-center text-2xl font-semibold'>
              <DownloadIcon className='mr-1 h-5 w-5' />
              {compactNumber(stats.totalDownloads.toLocaleString())}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-muted-foreground'>
              Total Likes
            </dt>
            <dd className='flex flex-row items-center justify-center text-2xl font-semibold'>
              <ThumbsUpIcon className='mr-1 h-5 w-5' />
              {compactNumber(stats.totalLikes.toLocaleString())}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
