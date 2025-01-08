import Header from '@/components/header/header';
import ServiceSelectionSection from '@/components/sections/service-selection.section';
import { baseNavigationConfig } from '@/lib/configs/base-nav.config';

// This is the root of our project, our 'landing page'
export default async function LandingPage() {
  return (
    <>
      <Header service='all' config={baseNavigationConfig} />
      <ServiceSelectionSection />
    </>
  );
}
