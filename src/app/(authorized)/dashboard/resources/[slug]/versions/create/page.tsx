import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ResourceCreateVersion from '@/features/resources/components/forms/create-resource-version.form';
import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { projectGetIdBySlug } from '@/features/resources/queries/resource-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};
export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const resource = await projectGetById_WithUser(
    (await projectGetIdBySlug(slug))!,
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version</CardTitle>
        <CardDescription>
          Upload a new release/changelog to this resource
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResourceCreateVersion {...resource!} />
      </CardContent>
    </Card>
  );
}
