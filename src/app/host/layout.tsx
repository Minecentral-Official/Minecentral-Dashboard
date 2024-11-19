import { PropsWithChildren } from 'react';

import Header from '@/components/services/host/header';

export default function HostLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
