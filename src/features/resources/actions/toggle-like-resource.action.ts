'use server';

import resourceToggleLike from '@/features/resources/mutations/toggle-like.resource';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function resourceToggleLikeAction(resourceId: number) {
  const { user } = await validateSession();
  const result = await resourceToggleLike(resourceId, user.id);

  return result;
}
