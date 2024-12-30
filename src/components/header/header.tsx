import DataAvatar from '@/auth/components/avatar/data.avatar';
import AuthNav from '@/auth/components/dropdowns/auth.dropdown';
import Logo from '@/components/logo';
import NavDesktop from '@/components/nav/desktop.nav';
import NavMobile from '@/components/nav/mobile.nav';
import { NavigationConfig } from '@/components/nav/nav-config.type';
import { MinecentralServices } from '@/lib/types/services';

type HeaderProps = {
  service: MinecentralServices;
  config: NavigationConfig;
};

export default function Header({ service, config }: HeaderProps) {
  return (
    <header className='fixed left-0 top-0 z-40 w-full bg-background'>
      <div className='container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3'>
        <div className='hidden flex-row items-center justify-start gap-4 lg:flex'>
          <NavDesktop config={config} />
        </div>
        <div className='flex lg:justify-center'>
          <Logo service={service} />
        </div>
        <div className='flex w-full justify-end gap-4'>
          <AuthNav>
            <div>
              <DataAvatar />
            </div>
          </AuthNav>
        </div>
        <div className='flex w-12 shrink items-end justify-end lg:hidden'>
          <NavMobile config={config} />
        </div>
      </div>
    </header>
  );
}
