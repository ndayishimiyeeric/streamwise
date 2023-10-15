import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { db } from "@/lib/db";
import getSubscription from "@/lib/actions";
import MyAiForm from "@/app/dashboard/my-ai/_components/my-ai-form";
import { redirect } from "next/navigation";

async function Page() {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const userId = user?.id;
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
