"use client";

import React from "react";

import AppLogo from "@/components/app-logo";

import SidebarRoutes from "./sidebar-routes";

type AppSidebarProps = {};

const AppSidebar: React.FC<AppSidebarProps> = () => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-background shadow-sm">
      <div className="px-8 py-4">
        <div className="mb-4 flex border-b pb-4 lg:hidden">
          <AppLogo />
        </div>

        <div className="flex w-full flex-col">
          <SidebarRoutes />
        </div>
      </div>
    </div>
  );
};
export default AppSidebar;
