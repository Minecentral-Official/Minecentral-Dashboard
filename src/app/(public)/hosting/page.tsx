'use cache';

import HostCtaSection from '@/features/host/components/sections/general/host-cta.section';
import ComparisonSection from '@/features/host/components/sections/landing/comparison.section';
import { FeaturesSection } from '@/features/host/components/sections/landing/features.section';
import { HeroSection } from '@/features/host/components/sections/landing/hero.section';
import { PanelSection } from '@/features/host/components/sections/landing/panel.section';
import { PerformanceSection } from '@/features/host/components/sections/landing/performance.section';

export default async function HostLandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PanelSection />
      <PerformanceSection />
      <ComparisonSection />
      <HostCtaSection />
    </>
  );
}
