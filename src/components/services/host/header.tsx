import AuthNav from '@/auth/components/auth-nav';
import Logo from '@/components/logo';
import NavDesktop from '@/components/services/host/nav.desktop';
import NavMobile from '@/components/services/host/nav.mobile';
import { MinecentralServices } from '@/lib/types/services';

type HeaderProps = {
  service: MinecentralServices;
};

export default function Header({ service }: HeaderProps) {
  return (
    <header className='fixed left-0 top-0 z-40 w-full bg-background'>
      <div className='container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3'>
        <div className='hidden flex-row items-center justify-start gap-4 lg:flex'>
          <NavDesktop />
        </div>
        <div className='flex lg:justify-center'>
          <Logo service={service} />
        </div>
        <div className='flex w-full justify-end gap-4'>
          <AuthNav />
        </div>
        <div className='flex w-12 shrink items-end justify-end lg:hidden'>
          <NavMobile />
        </div>
      </div>
    </header>
  );
}
