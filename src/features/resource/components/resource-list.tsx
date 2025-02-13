import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import resourcesGetByUserId from '@/features/resource/queries/resources-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function ResourceList() {
  const { user } = await validateSession();
  const resources = await resourcesGetByUserId(user.id);

  return (
    <div className='grid gap-4'>
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader>
            <CardTitle>{resource.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4 text-sm text-muted-foreground'>
              Version: {resource.downloads}
            </p>
            <Link href={`/dashboard/resources/edit/${resource.id}`}>
              <Button variant='outline'>Edit Resource</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
