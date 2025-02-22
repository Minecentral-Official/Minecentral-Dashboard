import { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer';
import Header from '@/components/header/header';
import { hostNavigationConfig } from '@/features/host/lib/nav.config';

export default async function HostLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <Header service='hosting' config={hostNavigationConfig} />
      <div className='container pt-20'>{children}</div>
      <Footer />
    </main>
  );
}
