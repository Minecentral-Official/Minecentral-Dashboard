import { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer';
import Header from '@/components/header/header';
import { resourcesNavigationConfig } from '@/features/resources/lib/nav.config';

export default async function Page({ children }: PropsWithChildren) {
  return (
    <main>
      <Header config={resourcesNavigationConfig} />
      <div className='container pb-4 pt-16'>{children}</div>
      <Footer />
    </main>
  );
}
