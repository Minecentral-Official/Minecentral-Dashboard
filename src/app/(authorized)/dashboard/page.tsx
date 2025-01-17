import { redirect } from 'next/navigation';

export default async function Page() {
  redirect('/dashboard/account');
  return null;
}
