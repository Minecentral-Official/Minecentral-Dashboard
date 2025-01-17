import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getPublishedResources() {
  // This would be replaced with an actual API call or database query
  return [
    { id: 1, name: 'SuperMobs', version: '1.2.3' },
    { id: 2, name: 'EconomyPlus', version: '2.0.1' },
    { id: 3, name: 'WorldGuardExtended', version: '3.1.0' },
  ];
}

export default async function ResourceList() {
  const resources = await getPublishedResources();

  return (
    <div className='grid gap-4'>
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader>
            <CardTitle>{resource.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4 text-sm text-muted-foreground'>
              Version: {resource.version}
            </p>
            <Link href={`/dashboard/resource/edit/${resource.id}`}>
              <Button variant='outline'>Edit Resource</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
