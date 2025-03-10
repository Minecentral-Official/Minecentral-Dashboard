import { PropsWithChildren } from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tickets',
};

export default async function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
