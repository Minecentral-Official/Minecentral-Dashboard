import { RadioTowerIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ServerUpdateVotifierForm from '@/features/serverlist/components/forms/update-votifier.form';
import { serverGetBySlug } from '@/features/serverlist/queries/server-by-slug.get';
import { serverGetIdBySlug } from '@/features/serverlist/queries/server-get-id-by-slug.get';
import { serverGetVotifierByServerId } from '@/features/serverlist/queries/votifier-by-server-id';

type PageProps = {
  params: Promise<{ slug: string }>;
};

//Page to edit a resource
export default async function VotifierPage({ params }: PageProps) {
  const { slug } = await params;

  const serverId = (await serverGetIdBySlug(slug))!;
  const server = await serverGetBySlug(slug);
  //   const server = await serverGetById(serverId)
  const votifier = await serverGetVotifierByServerId(serverId);

  return (
    <>
      <Card className='rounded-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <RadioTowerIcon className='h-5 w-5 text-primary' />
            Voting
          </CardTitle>
          <CardDescription>
            Manage vote rewards, cooldown, and Votifier delivery for this
            server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServerUpdateVotifierForm
            serverId={serverId}
            data={votifier}
            voteCooldownHours={server?.voteCooldownHours ?? 24}
          />
        </CardContent>
      </Card>
    </>
  );
}
