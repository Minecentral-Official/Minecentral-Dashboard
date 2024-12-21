import { CTASection } from '@/components/services/host/sections/general/cta.section';
import ComparisonSection from '@/components/services/host/sections/landing/comparison.section';
import { FeaturesSection } from '@/components/services/host/sections/landing/features.section';
import { HeroSection } from '@/components/services/host/sections/landing/hero.section';
import { PanelSection } from '@/components/services/host/sections/landing/panel.section';
import { PerformanceSection } from '@/components/services/host/sections/landing/performance.section';

export default async function HostLandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PanelSection />
      <PerformanceSection />
      <ComparisonSection />
      <CTASection />
    </>
  );
}
