import Header from '@/components/header/header';
import ServiceSelectionSection from '@/components/sections/service-selection.section';
import { hostNavigationConfig } from '@/features/host/lib/nav.config';
import getProductsHost from '@/stripe/queries/products/products-host.query';

// This is the root of our project, our 'landing page'
export default async function LandingPage() {
  const hostProducts = await getProductsHost();
  console.log('hostProducts', hostProducts);
  return (
    <>
      <Header service='host' config={hostNavigationConfig} />
      <ServiceSelectionSection />
    </>
  );
}
