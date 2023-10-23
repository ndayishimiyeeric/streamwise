import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user) {
    return redirect("/auth-callback?origin=upgrade");
  }
  return <>{children}</>;
}

export default Layout;
