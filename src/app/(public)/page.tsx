import Header from '@/components/header/header';
import ServiceSelectionSection from '@/components/sections/service-selection.section';
import { baseNavigationConfig } from '@/lib/configs/base-nav.config';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minecentral - Home',
  description: 'One-Stop-Shop for anything Minecraft',
};

// This is the root of our project, our 'landing page'
export default function LandingPage() {
  return (
    <>
      <Header config={baseNavigationConfig()} />
      <ServiceSelectionSection />
    </>
  );
}
