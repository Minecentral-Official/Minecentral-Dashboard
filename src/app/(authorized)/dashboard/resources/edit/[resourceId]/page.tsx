type PageProps = {
  params: Promise<{ resourceId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = await params;

  return <>{resourceId}</>;
}
