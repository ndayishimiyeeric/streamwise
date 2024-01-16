"use client";

import React from "react";
import { DrawerBody, InlineDrawer, makeStyles, shorthands } from "@fluentui/react-components";

import AppLogo from "@/components/app-logo";

import SidebarRoutes from "./sidebar-routes";

const useStyles = makeStyles({
  root: {
    ...shorthands.border("2px", "solid", "#ccc"),
    ...shorthands.overflow("hidden"),
    display: "flex",
    height: "480px",
    backgroundColor: "#fff",
  },

  content: {
    ...shorthands.flex(1),
    ...shorthands.padding("16px"),
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

type AppSidebarProps = {};

const AppSidebar: React.FC<AppSidebarProps> = () => {
  const styles = useStyles();
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r-2">
      <InlineDrawer open className="min-h-full shadow-sm">
        <DrawerBody>
          <div className="mb-4 flex border-b pb-4 lg:hidden">
            <AppLogo />
          </div>

          <div className="flex w-full flex-col">
            <SidebarRoutes />
          </div>
        </DrawerBody>
      </InlineDrawer>
    </div>
  );
};
export default AppSidebar;
