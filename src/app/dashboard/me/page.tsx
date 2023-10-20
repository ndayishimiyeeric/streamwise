import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getSubscription } from "@/lib/actions";
import UserDataForm from "./_components/user-data-form";

async function Page() {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const userId = user?.id;
  if (!userId) {
    redirect("/auth-callback?origin=/dashboard/my-ai");
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
