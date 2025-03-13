import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ResourceUpdateTagsForm_Plugin from '@/features/resources/components/forms/update-resource-tags-plugin.form';
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
        <CardTitle>Tags</CardTitle>
        <CardDescription>
          Select the most accurage tags to help others find your plugin more
          easily. Apply all relateable tags that apply.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResourceUpdateTagsForm_Plugin {...resource!} />
      </CardContent>
    </Card>
  );
}
