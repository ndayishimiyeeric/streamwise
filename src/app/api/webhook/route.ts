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

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      if (!session?.metadata?.userId && !session?.metadata?.plan) {
        return new NextResponse("No user id and plan", { status: 400 });
      }

      // check if the user had a subscription before
      const dbSubscription = await db.subscription.findUnique({
        where: {
          userId: session?.metadata.userId,
        },
      });

      if (dbSubscription) {
        const currentSubscription = await stripe.subscriptions.list({
          customer: dbSubscription.stripeCustomerId!,
          status: "active",
          limit: 1,
        });

        if (currentSubscription) {
          await stripe.subscriptions.cancel(currentSubscription?.data[0].id, {
            cancellation_details: { comment: "User changed plan" },
          });

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
        }
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
      const userSub = await db.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id as string,
        },
        data: {
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

      await db.userPurchase.create({
        data: {
          userId: userSub.userId,
          amount: subscription.items.data[0].price.unit_amount as number,
          success: true,
        },
      });
    }
    return new NextResponse(null, { status: 200 });
  } catch (e) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
