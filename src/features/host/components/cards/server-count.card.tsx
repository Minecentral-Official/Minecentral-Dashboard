import { type ComponentProps } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { userGetPterodactylServers } from '@/features/host/pterodactyl/queries/get-servers.user';

type ServerCountCardProps = {
  cardProps?: ComponentProps<typeof Card>;
  // Can add props for other subcomponents here
};

export default async function ServerCountCard({
  cardProps,
}: ServerCountCardProps) {
  const serverData = await userGetPterodactylServers();
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
