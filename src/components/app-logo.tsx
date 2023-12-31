import React from "react";
import Image from "next/image";

const AppLogo = () => {
  return (
    <div className="relative h-10 w-48">
      <Image
        src="/logo-dark.svg"
        fill
        alt="site logo"
        className="hidden object-contain dark:block"
      />
      <Image src="/logo-light.svg" fill alt="site logo" className="object-contain dark:hidden" />
    </div>
  );
};
export default AppLogo;
