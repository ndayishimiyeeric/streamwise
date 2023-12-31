import React from "react";
import ClientPage from "./_components/client";
import { getSubscription } from "@/lib/actions";

async function Page() {
  const subscription = await getSubscription();

  return <ClientPage subscription={subscription} />;
}

export default Page;
