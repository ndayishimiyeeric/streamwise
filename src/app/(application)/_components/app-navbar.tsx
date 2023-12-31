import React from "react";
import { UserButton } from "@clerk/nextjs";

import AppLogo from "@/components/app-logo";

import MobileSidebar from "./app-mobile-sidebar";

const AppNavbar = () => {
  return (
    <div className="flex h-full items-center border-b bg-background p-4 shadow-sm">
      <MobileSidebar />
      <div className="hidden lg:flex">
        <AppLogo />
      </div>

      <div className="ml-auto flex gap-x-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
export default AppNavbar;
