'use cache';

import HostCtaSection from '@/features/host/components/sections/general/host-cta.section';
import { PricingFaqSection } from '@/features/host/components/sections/pricing/faq.section';
import PricingTableSection from '@/features/host/components/sections/pricing/table.section';

export default async function HostPricingPage() {
  return (
    <>
      <PricingTableSection />
      <PricingFaqSection />
      <HostCtaSection />
    </>
  );
}
