import { PropsWithChildren } from 'react';

import Header, { HeaderGap } from '@/components/header/header';
import { resourcesNavigationConfig } from '@/features/resources/lib/nav.config';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header config={resourcesNavigationConfig} />
      <div className='container pb-4'>
        <HeaderGap>{children} </HeaderGap>
      </div>
    </>
  );
}
