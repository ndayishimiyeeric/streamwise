"use client";

import React from "react";
import { UserLimit, UserUsage } from "@prisma/client";
import { MessagesSquare, ShoppingBag, UploadCloud } from "lucide-react";
import { TbPlant2 } from "react-icons/tb";
import { PiBookOpenBold } from "react-icons/pi";

import { getSubscription } from "@/lib/actions";
import { getPurchases } from "@/lib/actions/user-usage-actions";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FixedUsageCard from "@/app/dashboard/usage/_components/fixed-usage-card";
import UsageProgress from "@/app/dashboard/usage/_components/usage-progress";
import UsageCard from "@/app/dashboard/usage/_components/usage-card";

type Props = {
  subscription: Awaited<ReturnType<typeof getSubscription>>;
  purchases: Awaited<ReturnType<typeof getPurchases>>;
  userLimit: UserLimit;
  userUsage: UserUsage;
};

function ClientPage({ subscription, purchases, userLimit, userUsage }: Props) {
  return (
    <MaxWidthWrapper className="flex flex-col space-y-3 pt-8 px-2.5 md:px-3 lg:px-20">
      <div className="grid md:grid-cols-3 gap-2">
        <Card className="md:col-span-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-900">
              {subscription.isSubscribed
                ? "Current month usage"
                : "Limited plan usage"}
            </CardTitle>
            <CardDescription>
              Your <span className="font-bold">{subscription.name}</span>{" "}
              subscription resources usage
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2">
            <UsageCard
              title="Prompt usage"
              value={(userUsage.queryUsage / userLimit.queryLimit) * 100}
              limit={`${userLimit.queryLimit} Prompts`}
              icon={MessagesSquare}
            />
            <UsageCard
              title="Upload usage"
              value={
                (userUsage.pdfUploadUsage / userLimit.pdfUploadLimit) * 100
              }
              limit={`${userLimit.pdfUploadLimit} Uploads`}
              icon={UploadCloud}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-900">
              Plan limits
            </CardTitle>
            <CardDescription>
              Your <span className="font-bold">{subscription.name}</span>{" "}
              subscription fixed limits
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <FixedUsageCard
              title="Pages / PDF"
              icon={PiBookOpenBold}
              subscription={subscription}
              limit={`${userLimit.maxPagesPdf}PG`}
            />
            <FixedUsageCard
              title="Size / PDF"
              icon={TbPlant2}
              subscription={subscription}
              limit={`${userLimit.maxFileSize}MB`}
            />
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}

export default ClientPage;
