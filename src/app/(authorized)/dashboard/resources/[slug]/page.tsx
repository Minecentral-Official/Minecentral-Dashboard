import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectDeleteDialog } from '@/features/resources/components/dialog/project-delete.dialog';
import ResourceUpdateGeneralForm from '@/features/resources/components/forms/update-resource-general.form';
import resourceGetById_WithUser from '@/features/resources/queries/project-by-id-with-user.get';
import projectGetIdBySlug from '@/features/resources/queries/resource-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};

//Page to edit a resource
export default async function EditResourcePage({ params }: PageProps) {
  const { slug } = await params;

  const resource = await resourceGetById_WithUser(
    (await projectGetIdBySlug(slug))!,
  );

  if (!resource) return <>Cant find it...</>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Resource Information
          </CardTitle>
          <CardDescription>
            Edit your resource information here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceUpdateGeneralForm {...resource} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <p>Delete Resource</p>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <p>
            Removes your project forever. This action cannot be undone, please
            be careful!
          </p>
          <ProjectDeleteDialog {...resource} />
        </CardContent>
      </Card>
    </>
  );
}
