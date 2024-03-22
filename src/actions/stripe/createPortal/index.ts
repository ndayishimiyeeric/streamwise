"use server";

import { createOrRetrieveCustomer } from "@/data/stripe";

import { currentUser } from "@/lib/auth";
import { createSafeAction } from "@/lib/create-safe-action";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

import { CreatePortal } from "./schema";
import { InputType, OutputType } from "./types";

const handler = async (data: InputType): Promise<OutputType> => {
  const user = await currentUser();
  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const customer = await createOrRetrieveCustomer(user.email as string, user.id);

  if (!customer) {
    return {
      error: "Failed to create customer",
    };
  }

  const return_url = absoluteUrl("/manage");

  const { url } = await stripe.billingPortal.sessions.create({
    customer,
    return_url,
  });

  return {
    data: {
      url,
    },
  };
};

export const createPortalLink = createSafeAction(CreatePortal, handler);
