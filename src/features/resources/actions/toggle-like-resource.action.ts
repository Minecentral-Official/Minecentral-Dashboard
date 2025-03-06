'use server';

import { revalidateTag } from 'next/cache';

import resourceToggleLike from '@/features/resources/mutations/toggle-like.resource';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function resourceToggleLikeAction(resourceId: string) {
  const { user } = await validateSession();
  const result = await resourceToggleLike(resourceId, user.id);
  revalidateTag(`liked-${user.id}`);
  return result;
}
