import { ChevronsUpDown } from 'lucide-react';

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
          <CollapsibleTrigger asChild>
            <Button variant='ghost' className='m-2' size='icon'>
              <ChevronsUpDown />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <CardContent>Hello World</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
