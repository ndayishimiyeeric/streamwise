import React from "react";
import { FcCalendar } from "react-icons/fc";
import format from "date-fns/format";
import type { IconType } from "react-icons";

import { Card } from "@/components/ui/card";
import { getSubscription } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  icon: IconType;
  subscription: Awaited<ReturnType<typeof getSubscription>>;
  limit: string;
  iconDivClassNames?: string;
};

function FixedUsageCard({
  title,
  icon: Icon,
  subscription,
  limit,
  iconDivClassNames,
}: Props) {
  return (
    <Card className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition">
      <div className="flex flex-col gap-2">
        <div className="pt-2 px-2 flex w-full items-center justify-between space-x-2">
          <div
            className={cn(
              "h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-r from-[#80B3FF] to-[#687EFF] flex items-center justify-center",
              iconDivClassNames,
            )}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg md:text-base font-medium text-zinc-900">
                {title}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="px-2 mt-2 grid grid-cols-3 py-2 text-xs text-zinc-500">
        <div className="col-span-2 flex items-center gap-1">
          <FcCalendar className="w-5 h-5" />
          {subscription.isSubscribed &&
            format(subscription.stripeCurrentPeriodEnd!, "dd MMM")}
          {!subscription.isSubscribed && "N/A"}
        </div>
        <p className="flex items-center gap-2 text-gray-600 font-black text-sm truncate">
          {limit}
        </p>
      </div>
    </Card>
  );
}

export default FixedUsageCard;
