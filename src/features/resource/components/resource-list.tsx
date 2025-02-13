import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import resourceDelete from '@/features/resource/mutations/delete.resource';
import resourcesGetByUserId from '@/features/resource/queries/resources-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function ResourceList() {
  const { user } = await validateSession();
  const resources = await resourcesGetByUserId(user.id);

  const onClick = async (id: number) => {
    await resourceDelete(id);
    redirect('/');
  };

  return (
    <div className='grid gap-4'>
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader>
            <CardTitle>{resource.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/dashboard/resources/edit/${resource.id}`}>
              <Button variant='outline'>Edit Resource</Button>
            </Link>
            <Button onClick={() => onClick(resource.id)}>Delete</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
