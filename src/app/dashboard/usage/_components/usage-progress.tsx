import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UsageProgressProps {
  variant?: "default" | "success" | "danger";
  size?: "default" | "sm";
  value: number;
}

const colorVariants = {
  default: "text-sky-700",
  success: "text-emerald-700",
  danger: "text-red-700",
};

const sizeVariants = {
  default: "text-sm",
  sm: "text-xs",
};

function UsageProgress({ variant, size, value }: UsageProgressProps) {
  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <Progress className="h-2 col-span-2" value={value} variant={variant} />
      <p
        className={cn(
          "font-medium text-sm text-sky-700",
          colorVariants[variant || "default"],
          sizeVariants[size || "default"],
        )}
      >
        {Math.round(value)}%
      </p>
    </div>
  );
}

export default UsageProgress;
