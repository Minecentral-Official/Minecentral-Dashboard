import { Suspense } from 'react';

import { BoxIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { HeaderQuickLinks } from '@/components/header/header-quick-links';
import Logo from '@/components/logos/logo';
import NavDesktop from '@/components/nav/desktop.nav';
import NavMobile from '@/components/nav/mobile.nav';
import { NavigationConfig } from '@/components/nav/nav-config.type';
import { ProjectCreateDialog } from '@/features/resources/components/dialog/project-create.dialog';
import DataAvatar from '@/lib/auth/components/avatar/data.avatar';
import AuthNav from '@/lib/auth/components/dropdowns/auth.dropdown';

type HeaderProps = {
  config: NavigationConfig;
};

export default function Header({ config }: HeaderProps) {
  return (
    <header className='fixed left-0 top-0 z-40 w-full bg-background'>
      <div className='container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3'>
        <div className='flex w-12 shrink lg:hidden'>
          <NavMobile config={config} />
        </div>
        <div className='hidden flex-row items-center justify-start gap-4 lg:flex'>
          <NavDesktop config={config} />
        </div>
        <Link href={`/`} className='flex lg:justify-center'>
          <Logo />
        </Link>

        <div className='flex w-full items-center justify-end gap-4'>
          <HeaderQuickLinks
            CreateProject={
              <ProjectCreateDialog className='flex flex-row items-center gap-2 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground'>
                <BoxIcon className='h-4 w-4' />
                New Project
              </ProjectCreateDialog>
            }
          />
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
