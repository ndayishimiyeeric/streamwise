import React from "react";
import { auth } from "@clerk/nextjs";

import ClientPage from "./_components/clientPage";
import { getPurchases, getSubscription } from "@/lib/actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getGraphData } from "@/lib/actions";

async function UsagePage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/dashboard");
  }
  const subscription = await getSubscription();
  const purchases = await getPurchases();
  const userLimit = await db.userLimit.findFirst({
    where: {
      userId,
    },
  });

  const usageUsage = await db.userUsage.findFirst({
    where: {
      userId,
    },
  });

  const graphData = await getGraphData(userId);

  return (
    <ClientPage
      subscription={subscription}
      purchases={purchases}
      userLimit={userLimit!}
      userUsage={usageUsage!}
      graphData={graphData}
    />
  );
}

export default UsagePage;
