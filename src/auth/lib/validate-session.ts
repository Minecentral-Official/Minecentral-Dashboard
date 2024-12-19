import getSession from '@/auth/lib/get-session';

export default async function validateSession() {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
