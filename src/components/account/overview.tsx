import { EarthIcon, PlugIcon as Plugin, Server } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HostServerCount from '@/features/host/components/data-driven/server-count.data';
import DataAvatar from '@/lib/auth/components/avatar/data.avatar';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function AccountOverview() {
  const { user } = await validateSession();
  return (
    <Card className='col-span-2 md:col-span-1'>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-6 flex items-center space-x-4'>
          <DataAvatar />
          <div>
            <h2 className='text-2xl font-bold'>{user.name}</h2>
            <p className='text-muted-foreground'>{user.email}</p>
            {/* <Badge variant='secondary' className='mt-2'>
                Premium Member
              </Badge> */}
          </div>
        </div>
        <div className='mt-6 grid grid-cols-3 gap-4'>
          <div className='flex flex-col items-center'>
            <Server className='mb-2 h-8 w-8 text-primary' />
            <span className='text-2xl font-bold'>
              <HostServerCount />
            </span>
            <span className='text-sm text-muted-foreground'>
              Hosted Servers
            </span>
          </div>
          <div className='flex flex-col items-center'>
            <EarthIcon className='mb-2 h-8 w-8 text-primary' />
            <span className='text-2xl font-bold'>0</span>
            <span className='text-sm text-muted-foreground'>Posted Worlds</span>
          </div>
          <div className='flex flex-col items-center'>
            <Plugin className='mb-2 h-8 w-8 text-primary' />
            <span className='text-2xl font-bold'>0</span>
            <span className='text-sm text-muted-foreground'>
              Published Plugins
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
