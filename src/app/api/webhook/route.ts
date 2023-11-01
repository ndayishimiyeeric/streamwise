import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import stripe from "@/lib/stripe";
import { db } from "@/lib/db";
import { PLANS } from "@/config/plans/plan";

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const sig = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (e: any) {
      return new NextResponse(`Webhook error ${e.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (!session?.metadata?.userId && !session?.metadata?.plan) {
      return new NextResponse("No user id and plan", { status: 200 });
    }

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      // check if the user had a subscription before
      const dbSubscription = await db.subscription.findUnique({
        where: {
          userId: session?.metadata.userId,
        },
      });

      if (dbSubscription) {
        await db.subscription.update({
          where: {
            userId: session?.metadata.userId,
          },
          data: {
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id as string,
            stripePriceId: subscription.items.data[0].price.id as string,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
      } else {
        await db.subscription.create({
          data: {
            userId: session?.metadata.userId,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id as string,
            stripePriceId: subscription.items.data[0].price.id as string,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
      }

      await db.userUsage.update({
        where: {
          userId: session?.metadata.userId,
        },
        data: {
          queryUsage: 0,
          pdfUploadUsage: 0,
        },
      });

      const newPlan = session?.metadata.plan;
      const plan = PLANS.find(
        (p) => p.slug.toLowerCase() === newPlan?.toLowerCase(),
      );

      if (plan) {
        await db.userLimit.update({
          where: {
            userId: session?.metadata.userId,
          },
          data: {
            queryLimit: plan.promptLimit,
            pdfUploadLimit: plan.quota,
            maxFileSize: plan.fileSize,
            maxPagesPdf: plan.pagePerPdf,
          },
        });

        await db.userPurchase.create({
          data: {
            userId: session?.metadata.userId,
            amount: plan.price.amount,
            success: true,
          },
        });
      }
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      const newPlan = session?.metadata.plan;
      const plan = PLANS.find(
        (p) => p.slug.toLowerCase() === newPlan?.toLowerCase(),
      );

      const userSub = await db.subscription.upsert({
        where: {
          stripeSubscriptionId: subscription.id as string,
        },
        update: {
          stripePriceId: subscription.items.data[0].price.id as string,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
        create: {
          userId: session?.metadata?.userId!,
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id as string,
          stripePriceId: subscription.items.data[0].price.id as string,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });

      await db.userUsage.update({
        where: {
          userId: userSub.userId,
        },
        data: {
          queryUsage: 0,
          pdfUploadUsage: 0,
        },
      });

      if (plan) {
        // if there is a purchase, in current month then don't create a new purchase
        const purchase = await db.userPurchase.findFirst({
          where: {
            userId: userSub.userId,
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        });

        if (!purchase) {
          await db.userPurchase.create({
            data: {
              userId: userSub.userId,
              amount: plan.price.amount,
              success: true,
            },
          });
        }
      }
    }
    return new NextResponse(null, { status: 200 });
  } catch (e) {
    console.error("webhook error", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
