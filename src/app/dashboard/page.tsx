import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Dashboard from "@/components/dashboard";

async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.email || !user.id) {
    redirect("/api/auth/login?origin=dashboard");
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
  }
  return <Dashboard />;
}

export default DashboardPage;
