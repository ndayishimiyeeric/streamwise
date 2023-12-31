import React from "react";
import { format } from "date-fns";
import type { IconType } from "react-icons";
import { FcCalendar } from "react-icons/fc";

import { getSubscription } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  icon: IconType;
  subscription: Awaited<ReturnType<typeof getSubscription>>;
  limit: string;
  iconDivClassNames?: string;
};

function FixedUsageCard({ title, icon: Icon, subscription, limit, iconDivClassNames }: Props) {
  return (
    <Card className="col-span-1 divide-y rounded-lg shadow-none transition">
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between space-x-2 px-2 pt-2">
          <div
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted",
              iconDivClassNames
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg font-medium md:text-base">{title}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 px-2 py-2 text-xs">
        <div className="col-span-2 flex items-center gap-1">
          <FcCalendar className="h-5 w-5" />
          {subscription.isSubscribed && format(subscription.stripeCurrentPeriodEnd!, "dd MMM")}
        </div>
        <p className="flex items-center gap-2 truncate text-sm font-black">{limit}</p>
      </div>
    </Card>
  );
}

export default FixedUsageCard;
