import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscription } from "@/data/user";

import { db } from "@/lib/db";

import MyAiForm from "./_components/my-ai-form";

async function Page() {
  const session = await auth();
  if (!session?.user.id) {
    redirect("/auth/login");
  }
  const aiData = await db.aiData.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!aiData) {
    redirect("/auth-callback?origin=dashboard/my-ai");
  }

  const subscriptionPlan = await getSubscription(session.user.id);
  return <MyAiForm subscriptionPlan={subscriptionPlan} aiData={aiData} />;
}

export default Page;
