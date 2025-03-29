import { PlusCircleIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ServerOverview from '@/features/serverlist/components/ui/realm-overview';
import { ServerCard } from '@/features/serverlist/components/ui/server-card';
import { ServerCreateDialog } from '@/features/serverlist/dialog/server-create.dialog';
import { serverGetByUserId } from '@/features/serverlist/queries/server-by-user-id.get';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function Page() {
  const { user } = await validateSession();
  const server = await serverGetByUserId(user.id);
  return (
    <div className='flex flex-col gap-6 lg:grid lg:grid-cols-3'>
      <div className='lg:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>My Realm</h2>
        </div>
        {server && <ServerData {...server} />}
      </div>
      <div>
        {server && <ServerOverview {...server} />}
        {!server && (
          <ServerCreateDialog className='flex w-full'>
            <Button className='flex w-full flex-row items-center gap-2'>
              <PlusCircleIcon className='h-4 w-4' />
              Create your first Realm
            </Button>
          </ServerCreateDialog>
        )}
      </div>
    </div>
  );
}

function ServerData(server: T_DTOServer) {
  return (
    <div className='flex flex-col gap-4'>
      <ServerCard {...server} />
      <Button className='w-full' asChild>
        <Link href={`/dashboard/servers/${server.slug}`}>
          <SettingsIcon className='h-4 w-4' />
          Edit Realm
        </Link>
      </Button>
    </div>
  );
}
