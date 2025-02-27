import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResourceUpdateDescriptionForm from '@/features/resources/components/forms/update-resource-description.form';
import resourceGetById_WithUser from '@/features/resources/queries/resource-by-id-with-user.get';
import resourceGetIdBySlug from '@/features/resources/queries/resource-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};
export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const resource = await resourceGetById_WithUser((await resourceGetIdBySlug(slug))!);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p>Description</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResourceUpdateDescriptionForm {...resource!} />
      </CardContent>
    </Card>);
}
