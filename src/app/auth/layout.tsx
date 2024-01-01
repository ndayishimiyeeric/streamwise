import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <div className="flex h-full items-center justify-center">{children}</div>;
};

export default AuthLayout;
