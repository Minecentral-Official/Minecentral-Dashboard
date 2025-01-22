import { HostSubscription } from '@/lib/db/schema';
import { DTOSubscriptionStripe } from '@/lib/stripe/dto/subscription.dto';

export type THostPayment = {
  stripeSubscription: ReturnType<typeof DTOSubscriptionStripe>;
  // stripeCustomer: typeof DTOCustomerStripe | undefined;
  hostSubscription: HostSubscription | undefined;
};
