import ServiceSelectionSection from '@/components/services/general/sections/service-selection.section';
import Header from '@/components/services/host/header';
import getProductsHost from '@/stripe/queries/products/products-host.query';

// This is the root of our project, our 'landing page'
export default async function LandingPage() {
  const hostProducts = await getProductsHost();
  console.log('hostProducts', hostProducts);
  return (
    <>
      <Header service='host' />
      <ServiceSelectionSection />
    </>
  );
}
