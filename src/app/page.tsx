import getHostProducts from '@/features/stripe/queries/host/host-products.query';

export default async function Home() {
  const hostProducts = await getHostProducts();
  console.log('hostProducts', hostProducts);
  return <>Default Page</>;
}
