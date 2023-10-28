import React from "react";
import ClientPage from "./_components/client";
import { getSubscription } from "@/lib/actions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user) {
    return redirect("/auth-callback?origin=upgrade");
  }

  const subscription = await getSubscription();

  return <ClientPage subscription={subscription} />;
}

export default Page;
