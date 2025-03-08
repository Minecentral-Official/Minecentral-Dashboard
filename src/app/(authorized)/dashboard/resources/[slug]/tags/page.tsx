type PageProps = {
  params: Promise<{ slug: string }>;
};
export default async function Page({}: PageProps) {
  // const { slug } = await params;

  // const resource = await projectGetById_WithUser(
  //   (await projectGetIdBySlug(slug))!,
  // );
  return <>Coming soon</>;
}
