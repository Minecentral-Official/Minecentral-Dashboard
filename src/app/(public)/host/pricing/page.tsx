import HostCtaSection from '@/features/host/components/sections/general/host-cta.section';
import { FaqSection } from '@/features/host/components/sections/pricing/faq-section';
import { TableSection } from '@/features/host/components/sections/pricing/table-section';

export default function HostPricingPage() {
  return (
    <>
      <TableSection />
      <FaqSection />
      <HostCtaSection />
    </>
  );
}
