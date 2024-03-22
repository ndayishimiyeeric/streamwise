"use server";

import { revalidatePath } from "next/cache";
import { createOrRetrieveCustomer } from "@/data/stripe";
import Stripe from "stripe";

import { currentUser } from "@/lib/auth";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

import { CreateSession } from "./schema";
import { InputType, OutputType } from "./types";

const handler = async (data: InputType): Promise<OutputType> => {
  const session_user = await currentUser();

  if (!session_user) {
    return {
      error: "Not authenticated",
    };
  }

  const { priceId, quantity = 1, metadata, type } = data;
  const cancel_url = absoluteUrl("/manage");
  const success_url = absoluteUrl("/manage?success=true");

  const customer = await createOrRetrieveCustomer(session_user.email as string, session_user.id);

  let session: Stripe.Checkout.Session;
  if (type === "recurring") {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url,
      cancel_url,
    });
  } else if (type === "one_time") {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: JSON.parse(JSON.stringify(metadata)),
      },
      success_url,
      cancel_url,
    });
  } else {
    return {
      error: "Invalid session type",
    };
  }

  if (!session.url) {
    return {
      error: "Invalid session",
    };
  }

  return {
    data: { url: session.url },
  };
};

export const createStripeSession = createSafeAction(CreateSession, handler);
