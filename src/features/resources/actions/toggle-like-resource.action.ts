'use server';

import resourceToggleLike from '@/features/resources/mutations/toggle-like.resource';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function resourceToggleLikeAction(resourceId: string) {
  const { user } = await validateSession();
  const liked = await resourceToggleLike(resourceId, user.id);
  // revalidateTag(`resource-id-${resourceId}`);
  return { success: true, liked };
}
