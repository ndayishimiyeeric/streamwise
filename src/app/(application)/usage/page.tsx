import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getGraphData } from "@/data/user";

import { db } from "@/lib/db";

import ClientPage from "./_components/clientPage";

async function UsagePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/auth/login");
  }

  const usageUsage = await db.userUsage.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  const graphData = await getGraphData(session.user.id);

  return <ClientPage userUsage={usageUsage!} graphData={graphData} />;
}

export default UsagePage;
