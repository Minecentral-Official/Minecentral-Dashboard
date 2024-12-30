import { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer';
import Header from '@/components/header/header';
import { hostNavigationConfig } from '@/features/host/lib/nav.config';

export default function HostLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <Header service='host' config={hostNavigationConfig} />
      {children}
      <Footer />
    </main>
  );
}
