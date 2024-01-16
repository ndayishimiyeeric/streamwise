import Stripe from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { toDateTime } from "@/lib/utils";

export const upsertProductRecord = async (product: Stripe.Product) => {
  const parsedFeatures = product.features ? JSON.parse(JSON.stringify(product.features)) : null;
  const productRecord = await db.product.upsert({
    where: {
      stripeProductId: product.id,
    },
    update: {
      name: product.name,
      stripeProductId: product.id,
      description: product.description,
      active: product.active,
      metadata: product.metadata,
      image: product.images?.[0] ?? null,
      features: parsedFeatures,
    },
    create: {
      name: product.name,
      stripeProductId: product.id,
      description: product.description,
      active: product.active,
      metadata: product.metadata,
      image: product.images?.[0] ?? null,
      features: parsedFeatures,
    },
  });

  return productRecord;
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceRecord = await db.price.upsert({
    where: {
      priceId: price.id,
    },
    update: {
      productId: typeof price.product === "string" ? price.product : null,
      active: price.active,
      currency: price.currency,
      description: price.nickname ?? null,
      type: price.type,
      unitAmount: price.unit_amount,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? null,
      trialPeriodDays: price.recurring?.trial_period_days ?? null,
      metadata: price.metadata,
    },
    create: {
      productId: typeof price.product === "string" ? price.product : null,
      priceId: price.id,
      active: price.active,
      currency: price.currency,
      description: price.nickname ?? null,
      type: price.type,
      unitAmount: price.unit_amount,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? null,
      trialPeriodDays: price.recurring?.trial_period_days ?? null,
      metadata: price.metadata,
    },
  });

  return priceRecord;
};

export const createOrRetrieveCustomer = async (email: string, userId: string) => {
  const existingCustomer = await db.customer.findFirst({
    where: {
      userId,
    },
  });

  if (!existingCustomer || !existingCustomer.stripeCustomerId) {
    const customer = await stripe.customers.create({ email, metadata: { userId } });
    await db.customer.upsert({
      where: {
        userId,
      },
      update: {
        stripeCustomerId: customer.id,
      },
      create: {
        stripeCustomerId: customer.id,
        userId,
      },
    });

    return customer.id;
  }

  return existingCustomer.stripeCustomerId;
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string
) => {
  // GET CUSTOMER
  const customer = await db.customer.findFirst({
    where: {
      stripeCustomerId: customerId,
    },
  });

  if (!customer) throw new Error("Customer not found");

  // GET SUBSCRIPTION
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionRecord = await db.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    update: {
      userId: customer.userId,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
      canceledAt: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      currentPeriodStart: toDateTime(subscription.current_period_start).toISOString(),
      currentPeriodEnd: toDateTime(subscription.current_period_end).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      endedAt: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
      trialStart: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trialEnd: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
      metadata: subscription.metadata,
    },
    create: {
      stripeSubscriptionId: subscription.id,
      userId: customer.userId,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
      canceledAt: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      currentPeriodStart: toDateTime(subscription.current_period_start).toISOString(),
      currentPeriodEnd: toDateTime(subscription.current_period_end).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      endedAt: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
      trialStart: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trialEnd: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
      metadata: subscription.metadata,
    },
  });

  return subscriptionRecord;
};
