import React from "react";

import AppLogo from "@/components/app-logo";
import { UserButton } from "@/components/auth/user-button";

import MobileSidebar from "./app-mobile-sidebar";

const AppNavbar = () => {
  return (
    <div className="flex h-full items-center border-b p-4 shadow-sm">
      <MobileSidebar />
      <div className="hidden lg:flex">
        <AppLogo />
      </div>

      <div className="ml-auto flex gap-x-2">
        <UserButton />
      </div>
    </div>
  );
};
export default AppNavbar;
