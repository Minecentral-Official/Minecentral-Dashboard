type PageProps = {
  params: Promise<{ priceId: string }>;
};

export default async function Page({ params }: PageProps) {
  const priceId = (await params).priceId;
  return <div>{priceId}</div>;
}
