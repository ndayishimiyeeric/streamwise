"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Apps24Regular,
  Board24Regular,
  ChartPerson24Regular,
  CreditCardClock24Regular,
  Settings24Regular,
} from "@fluentui/react-icons";
import { BarChartBig, Bot, Compass, CreditCard, Layout, Settings } from "lucide-react";

import SidebarItem from "./sidebar-item";

type SidebarRoutesProps = {};

const routes = [
  {
    icon: Board24Regular,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Settings24Regular,
    label: "Settings & Beta",
    path: "/profile",
  },
  {
    icon: CreditCardClock24Regular,
    label: "Billing",
    path: "/manage",
  },
  {
    icon: ChartPerson24Regular,
    label: "Usage",
    path: "/usage",
  },
  {
    icon: Apps24Regular,
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
      {pathname.includes("/my-ai") && (
        <SidebarItem icon={Bot} label="Custom instrutions" path="/my-ai" />
      )}
    </div>
  );
};
export default SidebarRoutes;
