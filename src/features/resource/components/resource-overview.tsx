import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getResourceStats() {
  // This would be replaced with an actual API call or database query
  return {
    totalPlugins: 15,
    totalDownloads: 10000,
    averageRating: 4.7,
  };
}

export default async function ResourceOverview() {
  const stats = await getResourceStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-1 gap-4 text-center'>
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
              Average Rating
            </dt>
            <dd className='text-2xl font-semibold'>
              {stats.averageRating.toFixed(1)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
