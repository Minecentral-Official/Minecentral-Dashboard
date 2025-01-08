import HostCtaSection from '@/features/host/components/sections/general/host-cta.section';
import { FaqSection } from '@/features/host/components/sections/pricing/faq-section';
import PricingTableSection from '@/features/host/components/sections/pricing/pricing-table.section';
import getProductsHost from '@/features/host/queries/products.get';

export default async function HostPricingPage() {
  const asdf = await getProductsHost();
  console.log(asdf);
  return (
    <>
      <PricingTableSection />
      <FaqSection />
      <HostCtaSection />
    </>
  );
}
