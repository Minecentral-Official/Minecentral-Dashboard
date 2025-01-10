import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PterodactylServerCard from '@/features/host/components/cards/pterodactyl-server.card';
import { hostGetUserPterdactylServers } from '@/features/host/queries/user-pterodactyl-servers.get';

export default async function HostServersPage() {
  const serverData = await hostGetUserPterdactylServers();
  console.log(serverData);
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap gap-6'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Total servers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='min-w-[200px] text-3xl font-bold'>31</div>
            <CardDescription>Servers</CardDescription>
          </CardContent>
        </Card>

        <Card className='flex-1'>
          <CardHeader>
            <CardTitle>Total invoice per month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='min-w-[200px] text-3xl font-bold'>31</div>
            <CardDescription>Servers</CardDescription>
          </CardContent>
        </Card>

        <Button className='h-auto flex-1 rounded-xl' asChild>
          <Link href='/dashboard/host/servers/add'>
            <Plus className='scale-150' />
          </Link>
        </Button>
      </div>
      {serverData.map(({ StripeProductData, pterodactylServerData }) => (
        <PterodactylServerCard
          key={pterodactylServerData.id}
          name={pterodactylServerData.name}
          plan={StripeProductData.name}
          status={pterodactylServerData.status}
        />
      ))}
    </div>
  );
}
