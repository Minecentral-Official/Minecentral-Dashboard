import { setAdmin } from '@/lib/auth/setadmin';

export default async function Page() {
  await setAdmin();
  return <>Setting as admin</>;
}
