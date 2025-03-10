import { PropsWithChildren, Suspense } from 'react';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import Logo from '@/components/logos/logo';
import { NavigationConfig } from '@/components/nav/nav-config.type';
import NavTopbar from '@/components/nav/top-navbar.nav';
import DataAvatar from '@/lib/auth/components/avatar/data.avatar';
import AuthNav from '@/lib/auth/components/dropdowns/auth.dropdown';

type HeaderProps = {
  config: NavigationConfig;
};

//Returns the padding neccessary due to the changing thickness of the Header component
export function HeaderGap({ children }: PropsWithChildren) {
  return <div className='mt-2 md:pt-[100px] xl:pt-20'>{children}</div>;
}

export default function Header({ config }: HeaderProps) {
  return (
    <header className='fixed left-0 top-0 z-40 hidden w-full bg-background py-2 md:block xl:py-0'>
      <div className='container relative mx-auto min-h-20 grid-cols-2 flex-row items-center gap-x-4 md:grid xl:grid xl:grid-cols-3'>
        {/* <div className='flex w-12 shrink xl:hidden'>
          <NavMobile config={config} />
        </div> */}
        <div className='order-2 col-span-2 mx-auto flex-row items-center justify-start gap-4 xl:order-1 xl:col-span-1 xl:mx-0'>
          <NavTopbar config={config} />
        </div>
        <Link href={`/`} className='order-0 flex lg:order-1 xl:justify-center'>
          <Logo />
        </Link>
        <div className='order-1 flex w-full items-center justify-end gap-4'>
          <Suspense>
            <AuthNav className='flex flex-row items-center gap-2 hover:cursor-pointer'>
              <DataAvatar /> <ChevronDown className='h-4 w-4' />
            </AuthNav>
          </Suspense>
        </div>
      </div>
    </header>
  );
}
