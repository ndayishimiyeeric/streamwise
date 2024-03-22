import { PropsWithChildren } from "react";
import Image from "next/image";

import { Footer } from "@/components/footer";
import { PublicNavbar } from "@/components/navbar/index";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="relative flex min-h-screen flex-col">
      <PublicNavbar />
      <section className="container mx-auto h-full max-w-6xl flex-1 pb-20 pt-40">
        <div className="relative z-1 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:from-transparent  dark:to-black/10" />
          <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
            <Image
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="/images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          {children}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default AuthLayout;
