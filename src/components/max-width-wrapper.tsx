import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

function MaxWidthWrapper({ className, children }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default MaxWidthWrapper;
