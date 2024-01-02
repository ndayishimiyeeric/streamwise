import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getGraphData, getPurchases, getSubscription } from "@/data/user";

import { db } from "@/lib/db";

import ClientPage from "./_components/clientPage";

async function UsagePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/auth/login");
  }
  const subscription = await getSubscription(session.user.id);
  const purchases = await getPurchases(session.user.id);
  const userLimit = await db.userLimit.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  const usageUsage = await db.userUsage.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  const graphData = await getGraphData(session.user.id);

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
