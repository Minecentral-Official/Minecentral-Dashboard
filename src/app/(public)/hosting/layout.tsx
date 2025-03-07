import { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer';
import Header from '@/components/header/header';
import { baseNavigationConfig } from '@/lib/configs/base-nav.config';

export default async function HostLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <Header config={baseNavigationConfig()} />
      <div className='container pt-20'>{children}</div>
      <Footer />
    </main>
  );
}
