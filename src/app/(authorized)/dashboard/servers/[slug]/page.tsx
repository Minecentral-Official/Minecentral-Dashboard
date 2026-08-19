import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import { ServerDeleteForm } from '@/features/serverlist/components/forms/delete-server.form';
import ServerUpdateGeneralForm from '@/features/serverlist/components/forms/update-server.form';
import { ServerPublishControls } from '@/features/serverlist/components/ui/server-publish-controls';
import { serverGetBySlug } from '@/features/serverlist/queries/server-by-slug.get';
import {
  serverIsPublicReady,
  serverMissingRequiredFields,
} from '@/features/serverlist/util/server-public-ready';

type PageProps = {
  params: Promise<{ slug: string }>;
};

//Page to edit a resource
export default async function EditResourcePage({ params }: PageProps) {
  const { slug } = await params;

  const server = await serverGetBySlug(slug);

  if (!server) return <>Cant find it...</>;
  const missing = serverMissingRequiredFields(server);
  const ready = serverIsPublicReady(server);

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Complete the checklist, then publish when you are ready.
              </CardDescription>
            </div>
            <Badge>{server.status === 'published' ? 'Published' : 'Draft'}</Badge>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {missing.length > 0 ?
            <ul className='grid gap-2 text-sm text-muted-foreground sm:grid-cols-2'>
              {missing.map((field) => (
                <li key={field}>Missing: {field}</li>
              ))}
            </ul>
          : <p className='text-sm text-muted-foreground'>
              This listing is ready to publish.
            </p>}
          <div className='flex flex-wrap gap-2'>
            <ServerPublishControls
              serverId={server.id}
              status={server.status}
              ready={ready}
            />
            {server.status === 'published' && (
              <Button variant='outline' asChild>
                <Link href={`/serverlist/${server.slug}`}>
                  <ExternalLinkIcon className='h-4 w-4' />
                  View public page
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Edit your public server listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerUpdateGeneralForm {...server} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <p>Danger</p>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <p>
            Removes your server listing forever. This action cannot be undone,
            please be careful!
          </p>
          <ServerDeleteForm serverId={server.id} title={server.title} />
        </CardContent>
      </Card>
    </>
  );
}
