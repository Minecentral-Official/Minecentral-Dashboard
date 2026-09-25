import Link from 'next/link';
import { notFound } from 'next/navigation';

import SignOutButton from '@/lib/auth/components/buttons/sign-out.button';
import validateSession from '@/lib/auth/helpers/validate-session';
import { featureFlags } from '@/lib/env/feature-flags';

export default async function ServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await validateSession();
  if (!featureFlags.workspaces) notFound();
  return (
    <div className='mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-8'>
      <header className='mb-8 flex items-center justify-between gap-4 border-b pb-4'>
        <div>
          <Link
            href='/servers'
            className='text-lg font-semibold tracking-tight'
          >
            MineCentral{' '}
            <span className='font-normal text-muted-foreground'>
              / My Servers
            </span>
          </Link>
          <p className='mt-1 text-xs text-muted-foreground'>
            Your private server workspaces
          </p>
        </div>
        <SignOutButton />
      </header>
      {children}
      <footer className='mt-12 border-t pt-5 text-sm text-muted-foreground'>
        <Link href='/dashboard' className='underline underline-offset-4'>
          Account and legacy dashboard
        </Link>
      </footer>
    </div>
  );
}

// Private workspace data is authorized at request time; loading.tsx supplies navigation feedback.
export const instant = false;
