import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SignInForm from '@/lib/auth/components/forms/sign-in.form';

export default function SignInPage() {
  return (
    <main className='flex h-screen w-screen items-center justify-center'>
      <Card className='sm:min-w-[300px]'>
        <CardHeader>
          <CardTitle>Log in to get started!</CardTitle>
          {/* <CardDescription>Enjoy!</CardDescription> */}
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
}
