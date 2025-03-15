import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TableProjectReleases } from '@/features/resources/components/resource/table/table-project-releases';
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
    <>
      <Button asChild>
        <Link href={`versions/create`}>Upload new version</Link>
      </Button>
      <TableProjectReleases releases={resource!.releases} />
    </>
  );
}
