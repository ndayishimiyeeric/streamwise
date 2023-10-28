import React from "react";
import { LucideIcon, ShoppingBag, UploadCloud } from "lucide-react";
import { IconType } from "react-icons";
import UsageProgress from "@/app/dashboard/usage/_components/usage-progress";
import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  value: number;
  limit: string;
  icon: LucideIcon | IconType;
};

function UsageCard({ title, value, limit, icon: Icon }: Props) {
  return (
    <Card className="divide-y divide-gray-200 rounded-lg bg-white shadow transition">
      <div className="flex flex-row items-center justify-between space-y-0 p-2">
        <h3 className="text-base font-medium truncate">{title}</h3>
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-r from-[#80B3FF] to-[#687EFF] flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div>
        <div className="flex flex-col p-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex-shrink-0 bg-sky-300/80 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-3 h-3 text-sky-700" />
            </div>
            <span className="text-sm text-gray-500">{limit}</span>
          </div>
          <div className="w-full">
            <UsageProgress
              value={value}
              variant={value === 100 ? "danger" : "default"}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default UsageCard;
