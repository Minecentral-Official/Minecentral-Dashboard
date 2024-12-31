import getSession from '@/lib/auth/helpers/get-session';

export default async function validateSession() {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
