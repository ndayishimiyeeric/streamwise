import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { db } from "@/lib/db";

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

    console.log(event);

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      if (!session?.metadata?.userId) {
        return new NextResponse("No user id", { status: 400 });
      }

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

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      await db.subscription.update({
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
    }
    return new NextResponse(null, { status: 200 });
  } catch (e) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
