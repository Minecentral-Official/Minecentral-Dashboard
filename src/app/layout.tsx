import type { Metadata } from 'next';

// we will have a separate css file for each 'project' in the future, just disabling the error here for now
// eslint-disable-next-line boundaries/element-types
import '@/app/globals.css';

import { Manrope } from 'next/font/google';

import { Footer } from '@/components/footer';
import Header, { HeaderGap } from '@/components/header/header';
import SearchParamTriggerSonner from '@/components/sonner/search-param-trigger.sonner';
import { Toaster } from '@/components/ui/sonner';
import { resourcesNavigationConfig } from '@/features/resources/lib/nav.config';
import { cn } from '@/lib/utils';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: {
    template: 'Minecentral | %s',
    default: 'Minecentral | Home',
  },
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      data-color-mode='dark'
      lang='en'
      className={cn('dark', manrope.className)}
    >
      <body>
        <Header config={resourcesNavigationConfig} />
        <div className='container pb-4'>
          <HeaderGap>{children} </HeaderGap>
        </div>
        <Footer />
        <Toaster richColors toastOptions={{}} />
        <SearchParamTriggerSonner />
      </body>
    </html>
  );
}
