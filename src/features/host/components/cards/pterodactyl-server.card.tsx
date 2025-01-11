import {
  BadgeCheck,
  ChartBarBig,
  ChevronsUpDown,
  CreditCard,
  Ellipsis,
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

type PterodactylServerCardProps = {
  name: string;
  plan: string;
};

export default function PterodactylServerCard({
  name,
  plan,
}: PterodactylServerCardProps) {
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
          <CardContent></CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
