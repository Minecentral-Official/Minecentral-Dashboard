import ResourceCardContent from '@/features/resources/components/resource/cards/resource-content.card';
import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { projectGetIdBySlug } from '@/features/resources/queries/resource-get-id-by-slug.get';
import getSession from '@/lib/auth/helpers/get-session';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const userResourceData = await projectGetById_WithUser(
    (await projectGetIdBySlug(slug))!,
    (await getSession())?.user.id,
  );

  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <ResourceCardContent {...userResourceData!} />
    </div>
  );
}
