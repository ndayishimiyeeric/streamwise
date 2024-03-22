import { SubscriptionWithProduct } from "@/types";
import { db } from "@/lib/db";

export const getSubscription = async (userId: string): Promise<SubscriptionWithProduct | null> => {
  const subscription = await db.subscription.findUnique({
    where: {
      userId,
    },
  });

  if (!subscription) {
    return null;
  }

  const product = await db.product.findUnique({
    where: {
      stripeProductId: subscription.priceId,
    },
  });

  if (!product) {
    return null;
  }

  const subscriptionWithProduct: SubscriptionWithProduct = {
    ...subscription,
    product,
  };

  return subscriptionWithProduct;
};

export const getActiveProductsWithPrices = async () => {
  const products = await db.product.findMany({
    where: {
      active: true,
    },
    include: {
      prices: {
        where: {
          active: true,
        },
        orderBy: {
          unitAmount: "asc",
        },
      },
    },
    orderBy: {
      prices: {
        _count: "desc",
      },
    },
  });

  return products;
};
