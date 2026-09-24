import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SignInForm from '@/lib/auth/components/forms/sign-in.form';
import getSession from '@/lib/auth/helpers/get-session';
import { safeReturnPath } from '@/lib/auth/helpers/safe-return-path';
import { serverEnv } from '@/lib/env/server.env';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const returnTo = safeReturnPath(params.returnTo);
  if (await getSession()) redirect(returnTo);
  const providers: ('discord' | 'github')[] = [];
  if (serverEnv.DISCORD_CLIENT_ID) providers.push('discord');
  if (serverEnv.GITHUB_CLIENT_ID) providers.push('github');
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <Card className='sm:min-w-[300px]'>
        <CardHeader>
          <CardTitle>Log in to get started</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm
            providers={providers}
            returnTo={returnTo}
            failed={Boolean(params.error)}
          />
        </CardContent>
      </Card>
    </main>
  );
}
