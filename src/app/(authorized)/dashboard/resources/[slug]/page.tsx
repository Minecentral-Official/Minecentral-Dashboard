import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResourceUpdateGeneralForm from '@/features/resources/components/forms/update-resource-general.form';
import resourceGetById from '@/features/resources/queries/resource-by-id.get';
import resourceGetIdBySlug from '@/features/resources/queries/resource-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};

//Page to edit a resource
export default async function EditResourcePage({ params }: PageProps) {
  const { slug } = await params;

  const resource = await resourceGetById((await resourceGetIdBySlug(slug))!);

  if (!resource) return <>Cant find it...</>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p>Resource Information</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResourceUpdateGeneralForm {...resource} />
      </CardContent>
    </Card>
  );
}
