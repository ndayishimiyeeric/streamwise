"use client";

import React from "react";
import { BarChartBig, Compass, Layout } from "lucide-react";

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
  return (
    <div className="mt-3 flex w-full flex-col space-y-3">
      {routes.map((route, idx) => (
        <SidebarItem key={idx} icon={route.icon} label={route.label} path={route.path} />
      ))}
    </div>
  );
};
export default SidebarRoutes;
