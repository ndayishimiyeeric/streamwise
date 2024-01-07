import React from "react";
import Image from "next/image";

import { RegisterForm } from "@/components/auth/register-form";

const RegisterPage = () => {
  return (
    <section className="relative z-1 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
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
      <RegisterForm />
    </section>
  );
};
export default RegisterPage;
