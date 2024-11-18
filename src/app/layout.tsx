import type { Metadata } from 'next';

// we will have a separate css file for each 'project' in the future, just disabling the error here for now
// eslint-disable-next-line boundaries/element-types
import './globals.css';

import { Manrope } from 'next/font/google';

import Header from '@/components/sections/host/header';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={manrope.className}>
      <body className={`antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
