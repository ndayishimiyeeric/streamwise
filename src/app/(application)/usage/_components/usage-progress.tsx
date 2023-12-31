import React from "react";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface UsageProgressProps {
  variant?: "default" | "success" | "danger";
  size?: "default" | "sm";
  value: number;
}

const colorVariants = {
  default: "text-primary",
  success: "text-emerald-700",
  danger: "text-red-700",
};

const sizeVariants = {
  default: "text-sm",
  sm: "text-xs",
};

function UsageProgress({ variant, size, value }: UsageProgressProps) {
  return (
    <div className="grid grid-cols-3 items-center gap-2">
      <Progress className="col-span-2 h-2" value={value} variant={variant} />
      <p
        className={cn(
          "text-sm font-medium text-sky-700",
          colorVariants[variant || "default"],
          sizeVariants[size || "default"]
        )}
      >
        {Math.round(value)}%
      </p>
    </div>
  );
}

export default UsageProgress;
