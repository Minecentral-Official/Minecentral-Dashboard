import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function webhookSubscriptionEnd(
  subscription: Stripe.Subscription,
  res: Response,
) {
  try {
    const productEnding = await db.query.productTable.findFirst({
      where: eq(productTable.subscriptionId, subscription.id),
      with: { user: true },
    });
    console.log(
      'Suspending server due to inactive Subscription from the user',
      productEnding?.user.name,
    );

    if (productEnding !== undefined && productEnding.pteroServerId !== -1) {
      //Suspend server
      try {
        (await pteroServer.getServer(productEnding.pteroServerId)).suspend();
      } catch (err) {
        console.log(
          'Could not suspend server',
          productEnding.pteroServerId,
          "on Pterodactyl's side",
        );
      } finally {
        console.log(
          'Server',
          productEnding.pteroServerId,
          'has been suspended!',
        );
      }
    } else {
      console.log(
        'There was no server to suspend, the server id was',
        productEnding?.pteroServerId,
      );
    }

    //Set Product to inactive on our side (incase people want to resub in the future)
    await db
      .update(productTable)
      .set({ active: false })
      .where(eq(productTable.subscriptionId, subscription.id));
    console.log('Deactivated Product from product table!');
    res.send({ status: 'ok', message: 'Deactivated users server!' });
  } catch (err) {
    throw err;
  }
}
