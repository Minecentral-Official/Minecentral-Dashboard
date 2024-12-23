import ServiceSelectionSection from '@/components/services/general/sections/service-selection.section';
import Header from '@/components/services/host/header';
import getHostProducts from '@/features/stripe/queries/host/host-products.query';

// This is the root of our project, our 'landing page'
export default async function LandingPage() {
  const hostProducts = await getHostProducts();
  console.log('hostProducts', hostProducts);
  return (
    <>
      <Header service='host' />
      <ServiceSelectionSection />
    </>
  );
}
