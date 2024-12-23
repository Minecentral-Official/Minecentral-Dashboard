import Header from '@/components/services/host/header';
import getHostProducts from '@/features/stripe/queries/host/host-products.query';

// This is the root of our project, our 'landing page'
export default async function LandingPage() {
  const hostProducts = await getHostProducts();
  console.log('hostProducts', hostProducts);
  return (
    <>
      <Header service='host' />
      <h1 className='mt-20'>Landing Page</h1>
    </>
  );
}
