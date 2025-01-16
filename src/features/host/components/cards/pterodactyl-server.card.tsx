import {
  Archive,
  BadgeCheck,
  Box,
  Database,
  Ellipsis,
  MemoryStick,
  Settings2Icon,
  SquareSplitVertical,
  Volleyball,
} from 'lucide-react';
import Link from 'next/link';

import CopyToClipboard from '@/components/etc/copy-to-clipboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type PterodactylServerCardProps = {
  name: string;
  // plan: string;
  cpuThreads: number;
  ram: number;
  storage: number;
  databases: number;
  backups: number;
  splits: number;
  ip?: string;
  port?: number;
  // status: ServerStatus;
  id: number;
  uuid: string;
  plan: string;
};

export default function PterodactylServerCard({
  name,
  cpuThreads,
  ram,
  storage,
  databases,
  backups,
  splits,
  ip,
  port,
  // status,
  id,
  uuid,
  plan,
}: PterodactylServerCardProps) {
  console.log(ip, port);
  return (
    <Card>
      <div className='flex justify-between'>
        <CardHeader className='flex w-full justify-between'>
          <div className='flex flex-row justify-between'>
            <CardTitle>{name}</CardTitle>
          </div>
          {/* <CardDescription>{plan}</CardDescription> */}
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
                  <Link href={`./servers/${id}`}>
                    <Settings2Icon />
                    Manage
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`https://panel.ronanhost.com/server/${uuid}`}>
                    <BadgeCheck />
                    Go To Panel
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='mb-4 flex items-center gap-2'>
        <Separator className='w-4' />
        <span className='text-xs text-muted-foreground'>{plan}</span>

        <Separator className='flex-1' />
        <CopyToClipboard clipboardText={ip + ':' + port} asChild>
          <span className='cursor-pointer select-none rounded p-1 px-2 text-xs text-muted-foreground transition hover:bg-primary hover:text-primary-foreground'>
            {ip}:{port}
          </span>
        </CopyToClipboard>
        <Separator className='w-4' />
      </div>
      <CardContent className='flex items-center justify-between'>
        <div className='flex gap-6'>
          <IconWithDataDisplay
            data={ram / 1024}
            icon={MemoryStick}
            name='RAM'
          />
          <IconWithDataDisplay
            data={cpuThreads / 100}
            icon={Volleyball}
            name='CPU Threads'
          />
          <IconWithDataDisplay
            data={storage / 1024}
            icon={Box}
            name='Storage'
          />
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
        {/* <ServerStatusDisplay status={status} /> */}
      </CardContent>
    </Card>
  );
}
