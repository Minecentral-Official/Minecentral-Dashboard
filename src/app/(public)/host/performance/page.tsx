'use cache';

import HostCtaSection from '@/features/host/components/sections/general/host-cta.section';
import PerformanceFeaturesGridSection from '@/features/host/components/sections/performance/performance-features-grid.section';
import PerformanceHeroSection from '@/features/host/components/sections/performance/performance-hero.section';

export default async function PerformancePage() {
  return (
    <>
      <PerformanceHeroSection />
      <PerformanceFeaturesGridSection />
      <HostCtaSection />
    </>
  );
}
