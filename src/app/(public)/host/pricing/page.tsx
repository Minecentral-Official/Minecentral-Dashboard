import HostCtaSection from '@/features/host/components/sections/general/host-cta.section';
import { FaqSection } from '@/features/host/components/sections/pricing/faq-section';
import PricingTableSection from '@/features/host/components/sections/pricing/pricing-table.section';

export default function HostPricingPage() {
  return (
    <>
      <PricingTableSection />
      <FaqSection />
      <HostCtaSection />
    </>
  );
}
