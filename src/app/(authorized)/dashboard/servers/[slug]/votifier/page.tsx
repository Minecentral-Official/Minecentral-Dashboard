import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ServerUpdateVotifierForm from '@/features/serverlist/components/forms/update-votifier.form';
import { serverGetIdBySlug } from '@/features/serverlist/queries/server-get-id-by-slug.get';
import { serverGetVotifierByServerId } from '@/features/serverlist/queries/votifier-by-server-id';

type PageProps = {
  params: Promise<{ slug: string }>;
};

//Page to edit a resource
export default async function VotifierPage({ params }: PageProps) {
  const { slug } = await params;

  const serverId = (await serverGetIdBySlug(slug))!;
  //   const server = await serverGetById(serverId)
  const votifier = await serverGetVotifierByServerId(serverId);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Votifier Information</CardTitle>
          <CardDescription>Edit your realm information here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerUpdateVotifierForm serverId={serverId} data={votifier} />
        </CardContent>
      </Card>
    </>
  );
}
