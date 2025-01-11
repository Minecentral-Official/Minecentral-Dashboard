import { type ComponentProps } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { hostGetUserPterdactylServers } from '@/features/host/queries/user-pterodactyl-servers.get';

type ServerCountCardProps = {
  cardProps?: ComponentProps<typeof Card>;
  // Can add props for other subcomponents here
};

export default async function ServerCountCard({
  cardProps,
}: ServerCountCardProps) {
  const serverData = await hostGetUserPterdactylServers();
  return (
    <Card {...cardProps}>
      <CardHeader>
        <CardTitle>Total servers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='min-w-[200px] text-3xl font-bold'>
          {serverData.length}
        </div>
        <CardDescription>Servers</CardDescription>
      </CardContent>
    </Card>
  );
}
