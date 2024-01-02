import React from "react";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return <>{children}</>;
}

export default Layout;
