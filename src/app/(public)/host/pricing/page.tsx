import { CTASection } from '@/components/services/host/sections/general/cta.section';
import { FaqSection } from '@/components/services/host/sections/pricing/faq-section';
import { TableSection } from '@/components/services/host/sections/pricing/table-section';

export default function HostPricingPage() {
  return (
    <>
      <TableSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
