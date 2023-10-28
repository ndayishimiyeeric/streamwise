import React from "react";

import ClientPage from "./_components/clientPage";
import { getPurchases, getSubscription } from "@/lib/actions";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function UsagePage() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user.id) {
    return redirect("/dashboard");
  }
  const subscription = await getSubscription();
  const purchases = await getPurchases();
  const userLimit = await db.userLimit.findFirst({
    where: {
      userId: user.id,
    },
  });

  const usageUsage = await db.userUsage.findFirst({
    where: {
      userId: user.id,
    },
  });

  return (
    <ClientPage
      subscription={subscription}
      purchases={purchases}
      userLimit={userLimit!}
      userUsage={usageUsage!}
    />
  );
}

export default UsagePage;
