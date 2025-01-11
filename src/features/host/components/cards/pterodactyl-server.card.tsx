import {
  Archive,
  BadgeCheck,
  Box,
  ChartBarBig,
  ChevronsUpDown,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  plan: string;
  cpuThreads: number;
  ram: number;
  storage: number;
  databases: number;
  backups: number;
  splits: number;
  ip?: string;
  port?: number;
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
}: PterodactylServerCardProps) {
  console.log(ip, port);
  return (
    <Card>
      <Collapsible>
        <div className='flex justify-between'>
          <CardHeader className='flex w-full justify-between'>
            <CardTitle>{name}</CardTitle>
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

            <CollapsibleTrigger asChild>
              <Button variant='ghost' size='icon'>
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className='mb-4 flex items-center gap-2'>
            <Separator className='w-4' />
            <span className='text-xs text-muted-foreground'>Plan Info</span>

            <Separator className='flex-1' />
          </div>
          <CardContent className='flex gap-6'>
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
