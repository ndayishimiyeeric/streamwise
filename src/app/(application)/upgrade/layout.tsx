import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/auth-callback?origin=upgrade");
  }
  return <>{children}</>;
}

export default Layout;
