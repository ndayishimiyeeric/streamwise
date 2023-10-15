import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";
import { PLANS } from "@/config/plans/plan";
import stripe from "@/lib/stripe";

const DAY_IN_MS = 86_400_000;

const getSubscription = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const userId = user?.id;

  if (!userId)
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };

  const subscription = await db.subscription.findUnique({
    where: {
      userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!subscription)
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };

  const isSubscribed =
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  const plan = isSubscribed
    ? PLANS.find((p) => p.price.priceIds.test === subscription.stripePriceId)
    : PLANS[0];

  let isCanceled = false;

  if (isSubscribed && subscription.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    isSubscribed,
    isCanceled,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    stripeCustomerId: subscription.stripeCustomerId,
    stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
  };
};

export default getSubscription;
