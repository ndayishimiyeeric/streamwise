import React from "react";
import { getActiveProductsWithPrices } from "@/data/subscriptions";

import { currentUser } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { Pricing } from "@/components/billing/pricing";

const ManagePage = async () => {
  const user = await currentUser();
  const products = await getActiveProductsWithPrices();

  return (
    <div className="container max-w-7xl p-10 pb-16">
      <div className="space-y-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">Manage your subscriptions and billing details</p>
        </div>
        <Separator className="my-6" />
        <Pricing
          products={products}
          action={user?.subscription ? "portal" : "session"}
          className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2"
        />
      </div>
    </div>
  );
};
export default ManagePage;
