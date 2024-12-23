import { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer';
import Header from '@/components/services/host/header';

export default function HostLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <Header service='host' />
      {children}
      <Footer />
    </main>
  );
}
