import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activityGetRecent } from '@/lib/activity/queries/recent-activity.get';

export default async function RecentActivity() {
  const activities = await activityGetRecent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <ul className=''>
          {activities.map(({ action, timestamp }, index) => (
            <li
              key={index}
              className={`flex items-center justify-between border-b p-2 ${index % 2 ? 'bg-gray-200' : 'bg-secondary'}`}
            >
              <span>{action}</span>
              <span className='text-sm text-muted-foreground'>
                {new Date(timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
