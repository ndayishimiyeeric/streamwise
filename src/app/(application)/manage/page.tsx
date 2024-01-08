import React from "react";
import { getActiveProductsWithPrices } from "@/data/subscriptions";

import { currentUser } from "@/lib/auth";
import { Pricing } from "@/components/billing/pricing";

const ManagePage = async () => {
  const user = await currentUser();
  const products = await getActiveProductsWithPrices();

  return (
    <div className="mx-auto max-w-7xl p-10">
      <Pricing
        products={products}
        action={user?.subscription ? "portal" : "session"}
        className="grid grid-cols-1 place-content-start sm:grid-cols-2"
      />
    </div>
  );
};
export default ManagePage;
