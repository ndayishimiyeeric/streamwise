import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getSubscription } from "@/lib/actions";
import { db } from "@/lib/db";

import MyAiForm from "./_components/my-ai-form";

async function Page() {
  const { userId } = auth();
  if (!userId) {
    redirect("/auth-callback?origin=/dashboard/my-ai");
  }
  const aiData = await db.aiData.findUnique({
    where: {
      userId,
    },
  });

  if (!aiData) {
    redirect("/auth-callback?origin=dashboard/my-ai");
  }

  const subscriptionPlan = await getSubscription();
  return <MyAiForm subscriptionPlan={subscriptionPlan} aiData={aiData} />;
}

export default Page;
