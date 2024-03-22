import React, { PropsWithChildren } from "react";

import AppNavbar from "./_components/app-navbar";
import AppSidebar from "./_components/app-sidebar";

const ApplicationLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full">
      <div className="fixed inset-x-0 z-50 h-[80px] w-full">
        <AppNavbar />
      </div>
      <div className="fixed inset-y-0 top-20 z-50 hidden h-full w-80 flex-col lg:flex">
        <AppSidebar />
      </div>
      <div className="h-full pt-[80px] lg:pl-80">{children}</div>
    </div>
  );
};
export default ApplicationLayout;
