import React from "react";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Dashboard from "@/components/dashboard";

async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/auth-callback?origin=dashboard");
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
  }
  return <Dashboard />;
}

export default DashboardPage;
