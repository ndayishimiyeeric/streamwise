"use client";

import React from "react";
import { BarChartBig, Compass, Layout, Settings } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";
// import { useAppearance } from "@/hooks";

import { Button } from "@/components/ui/button";

import SidebarItem from "./sidebar-item";

type SidebarRoutesProps = {};

const routes = [
  {
    icon: Layout,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: BarChartBig,
    label: "Usage",
    path: "/usage",
  },
  {
    icon: Compass,
    label: "Explore",
    path: "/explore",
  },
];

const SidebarRoutes: React.FC<SidebarRoutesProps> = () => {
  const { onOPen } = useSettings();

  return (
    <div className="mt-3 flex w-full flex-col space-y-3">
      {routes.map((route, idx) => (
        <SidebarItem key={idx} icon={route.icon} label={route.label} path={route.path} />
      ))}
      <Button
        className="w-full items-center justify-start"
        size="default"
        variant="ghost"
        onClick={onOPen}
      >
        <Settings className="mr-4 h-4 w-4" />
        <span className="truncate sm:block">Settings</span>
      </Button>
    </div>
  );
};
export default SidebarRoutes;
