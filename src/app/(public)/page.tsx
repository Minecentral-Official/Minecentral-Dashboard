import Header from '@/components/header/header';
import ServiceSelectionSection from '@/components/sections/service-selection.section';
import { baseNavigationConfig } from '@/lib/configs/base-nav.config';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minecental - Home',
  description: 'Your place for Minecraft',
};

// This is the root of our project, our 'landing page'
export default async function LandingPage() {
  return (
    <>
      <Header service='services' config={baseNavigationConfig} />
      <ServiceSelectionSection />
    </>
  );
}
