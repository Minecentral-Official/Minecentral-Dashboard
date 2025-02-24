import { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer';
import Header from '@/components/header/header';
import { resourcesNavigationConfig } from '@/features/resource-plugin/lib/nav.config';

export default async function ResourceLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <Header service='resources' config={resourcesNavigationConfig} />
      <div className='container pb-4 pt-20'>{children}</div>
      <Footer />
    </main>
  );
}
