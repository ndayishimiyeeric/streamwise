import React from "react";
import BillingForm from "@/app/dashboard/billing/_components/billing-form";
import { getSubscription } from "@/lib/actions";

async function Page() {
  const subscriptionPlan = await getSubscription();
  return <BillingForm subscriptionPlan={subscriptionPlan} />;
}

export default Page;
