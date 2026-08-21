import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleIcon,
  ExternalLinkIcon,
  ListChecksIcon,
  ServerCogIcon,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  if (!server) return <>Cannot find this server.</>;
  const missing = serverMissingRequiredFields(server);
  const ready = serverIsPublicReady(server);

  return (
    <>
      <Card className='overflow-hidden rounded-md'>
        <CardHeader>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <ListChecksIcon className='h-5 w-5 text-primary' />
                Launch checklist
              </CardTitle>
              <CardDescription>
                Complete the checklist, then publish when you are ready.
              </CardDescription>
            </div>
            <Badge
              className={
                server.status === 'published' ?
                  'border-emerald-200 bg-emerald-50 text-emerald-700'
                : ''
              }
            >
              {server.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-5'>
          {missing.length > 0 ?
            <ul className='grid gap-2 text-sm sm:grid-cols-2'>
              {missing.map((field) => (
                <li
                  key={field}
                  className='flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground'
                >
                  <CircleIcon className='h-3.5 w-3.5' />
                  {field}
                </li>
              ))}
            </ul>
          : <p className='flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
              <CheckCircle2Icon className='h-4 w-4' />
              This listing is ready to publish.
            </p>
          }
          <div className='flex flex-wrap items-center gap-2 border-t pt-5'>
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
      <Card className='rounded-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ServerCogIcon className='h-5 w-5 text-primary' />
            Profile
          </CardTitle>
          <CardDescription>
            Edit the public listing players see while browsing servers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServerUpdateGeneralForm {...server} />
        </CardContent>
      </Card>
      <Card className='rounded-md border-destructive/40'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangleIcon className='h-5 w-5 text-destructive' />
            Danger
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
