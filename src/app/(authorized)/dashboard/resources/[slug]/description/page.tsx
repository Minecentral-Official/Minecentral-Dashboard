import ResourceUpdateDescriptionForm from '@/features/resources/components/forms/update-resource-description.form';
import resourceGetById from '@/features/resources/queries/resource-by-id.get';
import resourceGetIdBySlug from '@/features/resources/queries/resource-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};
export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const resource = await resourceGetById((await resourceGetIdBySlug(slug))!);
  return <ResourceUpdateDescriptionForm {...resource!} />;
}
