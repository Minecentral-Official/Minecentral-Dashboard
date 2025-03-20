import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ServerUpdateGeneralForm from '@/features/serverlist/components/forms/update-server.form';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import { serverGetIdBySlug } from '@/features/serverlist/queries/server-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};

//Page to edit a resource
export default async function EditResourcePage({ params }: PageProps) {
  const { slug } = await params;

  const server = await serverGetById((await serverGetIdBySlug(slug))!);

  if (!server) return <>Cant find it...</>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Realm Information</CardTitle>
          <CardDescription>Edit your realm information here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerUpdateGeneralForm {...server} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <p>Delete Realm</p>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <p>
            Removes your realm/server forever. This action cannot be undone,
            please be careful!
          </p>
          {/* <ProjectDeleteDialog {...server} /> */}
        </CardContent>
      </Card>
    </>
  );
}
