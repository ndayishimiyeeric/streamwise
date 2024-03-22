import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscription } from "@/data/user";

import ClientPage from "./_components/client";

async function Page() {
  const session = await auth();
  if (!session?.user.id) {
    return redirect("/auth/login");
  }
  const subscription = await getSubscription(session.user.id);

  return <ClientPage subscription={subscription} />;
}

export default Page;
