import React from "react";
import { LucideIcon, ShoppingBag } from "lucide-react";
import { IconType } from "react-icons";

import { Card } from "@/components/ui/card";

import UsageProgress from "./usage-progress";

type Props = {
  title: string;
  value: number;
  limit: string;
  icon: LucideIcon | IconType;
};

function UsageCard({ title, value, limit, icon: Icon }: Props) {
  return (
    <Card className="divide-y rounded-lg shadow-none transition">
      <div className="flex flex-row items-center justify-between space-y-0 p-2">
        <h3 className="truncate text-base font-medium">{title}</h3>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <div className="flex flex-col p-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-3 w-3" />
            </div>
            <span className="text-sm">{limit}</span>
          </div>
          <div className="w-full">
            <UsageProgress value={value} variant={value === 100 ? "danger" : "default"} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default UsageCard;
