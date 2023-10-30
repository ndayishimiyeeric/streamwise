import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getSubscription } from "@/lib/actions";
import UserDataForm from "./_components/user-data-form";

async function Page() {
  const { userId } = auth();
  if (!userId) {
    redirect("/auth-callback?origin=/dashboard/me");
  }
  const dbUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard/me");
  }

  const subscriptionPlan = await getSubscription();
  return <UserDataForm subscriptionPlan={subscriptionPlan} data={dbUser} />;
}

export default Page;
