import React from "react";
import format from "date-fns/format";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  purchase: {
    date: Date;
    amount: number;
    status: string;
  };
};

function PurchaseCard({ purchase }: Props) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "outline",
          className: "pointer-events-none w-full justify-start gap-2 text-left font-normal",
        })
      )}
    >
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-4 w-4" />
        <span className="text-xs">{format(purchase.date, "MMM dd yy")}</span>
        <span className="text-xs">{format(purchase.date, "HH:mm")}</span>
      </div>
      <Separator orientation="vertical" className="h-2 w-2 rounded-full" />
      <span>€{purchase.amount}</span>
      <Separator orientation="vertical" className="h-2 w-2 rounded-full" />
      <span className="text-xs lowercase text-emerald-600">{purchase.status}</span>
    </div>
  );
}

export default PurchaseCard;
