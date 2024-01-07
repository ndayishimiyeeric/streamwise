import { PropsWithChildren } from "react";

import { Footer } from "@/components/footer";
import { PublicNavbar } from "@/components/navbar/index";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="relative flex min-h-screen flex-col">
      <PublicNavbar />
      <div className="container mx-auto h-full max-w-6xl flex-1 border-r-red-600 pb-20 pt-40">
        {children}
      </div>
      <Footer />
    </main>
  );
};

export default AuthLayout;
