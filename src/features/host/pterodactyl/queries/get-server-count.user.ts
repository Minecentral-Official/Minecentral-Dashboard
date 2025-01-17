import userGetHostSubscriptions from '@/features/host/queries/subscription/get-subscriptions.user';

import 'server-only';

type TSubscription = {
  id: number;
  pterodactylServerId: number | null;
  pterodactylServerUuid: string | null;
  stripeSubscriptionId: string;
  hostCustomerId: number;
};

export async function userGetPterodactylServerCount() {
  const subscriptions = await userGetHostSubscriptions();

  //Grab a list of host subscriptions that have servers attached
  const subscriptionsWithValidServerId = subscriptions.filter(
    (
      subscription,
    ): subscription is TSubscription & {
      pterodactylServerId: number;
      pterodactylServerUuid: string;
    } => !!subscription.pterodactylServerId,
  );

  return subscriptionsWithValidServerId.length;
}
