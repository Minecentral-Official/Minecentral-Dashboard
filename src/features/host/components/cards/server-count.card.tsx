import { type ComponentProps } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import HostServerCount from '@/features/host/components/data-driven/server-count.data';

type ServerCountCardProps = {
  cardProps?: ComponentProps<typeof Card>;
  // Can add props for other subcomponents here
};

export default async function ServerCountCard({
  cardProps,
}: ServerCountCardProps) {
  return (
    <Card {...cardProps}>
      <CardHeader>
        <CardTitle>Total servers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='min-w-[200px] text-3xl font-bold'>
          <HostServerCount />
        </div>
        <CardDescription>Servers</CardDescription>
      </CardContent>
    </Card>
  );
}
