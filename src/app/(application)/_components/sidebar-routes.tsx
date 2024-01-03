"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BarChartBig, Bot, Compass, CreditCard, Layout, Settings } from "lucide-react";

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
  const pathname = usePathname();
  return (
    <div className="mt-3 flex w-full flex-col space-y-3">
      {routes.map((route, idx) => (
        <SidebarItem key={idx} icon={route.icon} label={route.label} path={route.path} />
      ))}
      {pathname.includes("/profile") && (
        <SidebarItem icon={Settings} label="Settings & Beta" path="/profile" />
      )}
      {pathname.includes("/my-ai") && (
        <SidebarItem icon={Bot} label="Custom instrutions" path="/my-ai" />
      )}
      {pathname.includes("/upgrade") && (
        <SidebarItem icon={CreditCard} label="My plan" path="/upgrade" />
      )}
    </div>
  );
};
export default SidebarRoutes;
