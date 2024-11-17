import Login from '@/auth/components/login';
import SignUp from '@/auth/components/signup';

export default async function Home() {
  return (
    <>
      <SignUp />
      <Login />
    </>
  );
}
