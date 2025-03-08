import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import Logo from '@/components/logos/logo';
import NavDesktop from '@/components/nav/desktop.nav';
import NavMobile from '@/components/nav/mobile.nav';
import { NavigationConfig } from '@/components/nav/nav-config.type';
import DataAvatar from '@/lib/auth/components/avatar/data.avatar';
import AuthNav from '@/lib/auth/components/dropdowns/auth.dropdown';

type HeaderProps = {
  config: NavigationConfig;
};

export default function Header({ config }: HeaderProps) {
  return (
    <header className='fixed left-0 top-0 z-40 w-full bg-background'>
      <div className='container relative mx-auto flex min-h-20 flex-row items-center gap-4 xl:grid xl:grid-cols-3'>
        <div className='flex w-12 shrink xl:hidden'>
          <NavMobile config={config} />
        </div>
        <div className='hidden flex-row items-center justify-start gap-4 xl:flex'>
          <NavDesktop config={config} />
        </div>
        <Link href={`/`} className='flex xl:justify-center'>
          <Logo />
        </Link>

        <div className='flex w-full items-center justify-end gap-4'>
          <AuthNav className='flex flex-row items-center gap-2 hover:cursor-pointer'>
            <DataAvatar /> <ChevronDown className='h-4 w-4' />
          </AuthNav>
        </div>
      </div>
    </header>
  );
}
