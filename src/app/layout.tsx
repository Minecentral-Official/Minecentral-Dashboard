import type { Metadata } from 'next';

// we will have a separate css file for each 'project' in the future, just disabling the error here for now
// eslint-disable-next-line boundaries/element-types
import '@/app/globals.css';

import dynamic from 'next/dynamic';
import { Manrope } from 'next/font/google';

import { Footer } from '@/components/footer';
import SearchParamTriggerSonner from '@/components/sonner/search-param-trigger.sonner';
import { Toaster } from '@/components/ui/sonner';
import { serverEnv } from '@/lib/env/server.env';
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

let Toolbar: React.ComponentType = () => null;

if (serverEnv.NODE_ENV === 'development') {
  Toolbar = dynamic(() => import('@/components/ui/custom/next-cache-toolbar'));
}

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
        {children}
        <Footer />
        <Toaster richColors toastOptions={{}} />
        <SearchParamTriggerSonner />
        <Toolbar />
      </body>
    </html>
  );
}
