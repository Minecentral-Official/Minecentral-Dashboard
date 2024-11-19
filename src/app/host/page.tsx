import ComparisonSection from '@/components/services/host/sections/landing/compaarison-section';
import { CTASection } from '@/components/services/host/sections/landing/cta-section';
import { FeaturesSection } from '@/components/services/host/sections/landing/features-section';
import { HeroSection } from '@/components/services/host/sections/landing/hero-section';
import { PanelSection } from '@/components/services/host/sections/landing/panel-section';
import { PerformanceSection } from '@/components/services/host/sections/landing/performance-section';

export default function HostLandingPage() {
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
