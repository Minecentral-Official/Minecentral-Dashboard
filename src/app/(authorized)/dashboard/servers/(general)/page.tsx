import { PlusCircleIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServerCard } from '@/features/serverlist/components/ui/server-card';
import { ServerCreateDialog } from '@/features/serverlist/dialog/server-create.dialog';
import { serverListByUserId } from '@/features/serverlist/queries/server-list-by-user-id.get';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import { serverEnv } from '@/lib/env/server.env';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function Page() {
  const { user } = await validateSession();
  const servers = await serverListByUserId(user.id);
  const canCreate = servers.length < serverEnv.SERVERLIST_MAX_SERVERS_PER_USER;
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-semibold'>Server Listings</h2>
          <p className='text-sm text-muted-foreground'>
            {servers.length}/{serverEnv.SERVERLIST_MAX_SERVERS_PER_USER} listings used
          </p>
        </div>
        {canCreate ?
          <ServerCreateDialog className='flex w-full'>
            <Button className='flex w-full flex-row items-center gap-2 sm:w-auto'>
              <PlusCircleIcon className='h-4 w-4' />
              Create listing
            </Button>
          </ServerCreateDialog>
        : <Button disabled>Listing cap reached</Button>}
      </div>
      {servers.length > 0 ?
        <div className='grid gap-4'>
          {servers.map((server) => (
            <ServerData key={server.id} {...server} />
          ))}
        </div>
      : <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>
          No server listings yet.
        </div>}
      </div>
  );
}

function ServerData(server: T_DTOServer) {
  return (
    <div className='flex flex-col gap-3 rounded-md border p-3 lg:grid lg:grid-cols-[1fr_auto] lg:items-center'>
      <ServerCard {...server} />
      <div className='flex flex-col gap-2'>
        <Badge>{server.status === 'published' ? 'Published' : 'Draft'}</Badge>
        <Button className='w-full' asChild>
          <Link href={`/dashboard/servers/${server.slug}`}>
            <SettingsIcon className='h-4 w-4' />
            Manage
          </Link>
        </Button>
      </div>
    </div>
  );
}
