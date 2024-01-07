import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const AppLogo = ({ className, width, height }: AppLogoProps) => {
  return (
    <div className={cn("relative h-10 w-48", className)}>
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
