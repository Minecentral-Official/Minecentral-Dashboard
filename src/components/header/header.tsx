import Link from 'next/link';

import Logo from '@/components/logos/logo';
import NavDesktop from '@/components/nav/desktop.nav';
import NavMobile from '@/components/nav/mobile.nav';
import { NavigationConfig } from '@/components/nav/nav-config.type';
import DataAvatar from '@/lib/auth/components/avatar/data.avatar';
import AuthNav from '@/lib/auth/components/dropdowns/auth.dropdown';
import { MinecentralServices } from '@/lib/types/minecentral-services.type';

type HeaderProps = {
  service: MinecentralServices | 'services';
  config: NavigationConfig;
};

export default function Header({ service, config }: HeaderProps) {
  return (
    <header className='fixed left-0 top-0 z-40 w-full bg-background'>
      <div className='container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3'>
        <div className='hidden flex-row items-center justify-start gap-4 lg:flex'>
          <NavDesktop config={config} />
        </div>
        <Link href={`/${service}`} className='flex lg:justify-center'>
          <Logo service={service} />
        </Link>

        <div className='flex w-full justify-end gap-4'>
          <AuthNav>
            <DataAvatar />
          </AuthNav>
        </div>
        <div className='flex w-12 shrink items-end justify-end lg:hidden'>
          <NavMobile config={config} />
        </div>
      </div>
    </header>
  );
}
