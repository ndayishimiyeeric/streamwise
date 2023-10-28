import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import format from "date-fns/format";
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
          className:
            "justify-start text-left font-normal pointer-events-none w-full gap-2",
        }),
      )}
    >
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span className="text-xs">{format(purchase.date, "MMM yyyy")}</span>
      </div>
      <Separator orientation="vertical" className="h-2 w-2 rounded-full" />
      <span>€{purchase.amount}</span>
      <Separator orientation="vertical" className="h-2 w-2 rounded-full" />
      <span className="text-emerald-600 text-xs lowercase">
        {purchase.status}
      </span>
    </div>
  );
}

export default PurchaseCard;
