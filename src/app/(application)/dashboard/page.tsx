import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import Dashboard from "@/components/dashboard";

async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userLimit = await db.userLimit.findFirst({
    where: {
      userId: session.user.id,
    },
  });
  return <Dashboard uploadLimit={userLimit?.pdfUploadLimit} />;
}

export default DashboardPage;
