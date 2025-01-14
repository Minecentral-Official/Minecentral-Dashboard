import {
  Archive,
  BadgeCheck,
  Box,
  ChartBarBig,
  CreditCard,
  Database,
  Ellipsis,
  MemoryStick,
  SquareSplitVertical,
  Volleyball,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import IconWithDataDisplay from '@/features/host/components/etc/icon-with-data.display';
import ServerStatusDisplay from '@/features/host/components/etc/server-status.display';

import type { ServerStatus } from 'pterodactyl.ts';

type PterodactylServerCardProps = {
  name: string;
  plan: string;
  cpuThreads: number;
  ram: number;
  storage: number;
  databases: number;
  backups: number;
  splits: number;
  ip?: string;
  port?: number;
  status: ServerStatus;
};

export default function PterodactylServerCard({
  name,
  plan,
  cpuThreads,
  ram,
  storage,
  databases,
  backups,
  splits,
  ip,
  port,
  status,
}: PterodactylServerCardProps) {
  console.log(ip, port, status);
  return (
    <Card>
      <div className='flex justify-between'>
        <CardHeader className='flex w-full justify-between'>
          <div className='flex flex-row justify-between'>
            <CardTitle>{name}</CardTitle>
          </div>
          <CardDescription>{plan}</CardDescription>
        </CardHeader>
        <div className='m-2 flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href='/dashboard'>
                    <ChartBarBig />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='mb-4 flex items-center gap-2'>
        <Separator className='w-4' />
        <span className='text-xs text-muted-foreground'>Plan Info</span>

        <Separator className='flex-1' />
      </div>
      <CardContent className='flex items-center justify-between'>
        <div className='flex gap-6'>
          <IconWithDataDisplay data={ram} icon={MemoryStick} name='RAM' />
          <IconWithDataDisplay
            data={cpuThreads}
            icon={Volleyball}
            name='CPU Threads'
          />
          <IconWithDataDisplay data={storage} icon={Box} name='Storage' />
          <IconWithDataDisplay
            data={databases}
            icon={Database}
            name='Databases'
          />
          <IconWithDataDisplay data={backups} icon={Archive} name='Backups' />
          <IconWithDataDisplay
            data={splits}
            icon={SquareSplitVertical}
            name='Splits'
          />
        </div>
        <ServerStatusDisplay status={status} />
      </CardContent>
    </Card>
  );
}
