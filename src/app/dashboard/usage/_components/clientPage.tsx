"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UserLimit, UserUsage } from "@prisma/client";
import { MessagesSquare, UploadCloud } from "lucide-react";
import { TbPlant2 } from "react-icons/tb";
import { PiBookOpenBold } from "react-icons/pi";

import { getSubscription } from "@/lib/actions";
import { getPurchases, GraphData } from "@/lib/actions/user-usage-actions";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FixedUsageCard from "@/app/dashboard/usage/_components/fixed-usage-card";
import UsageCard from "@/app/dashboard/usage/_components/usage-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import PurchaseCard from "@/app/dashboard/usage/_components/purchase-card";
import Overview from "@/components/overview";

type Props = {
  subscription: Awaited<ReturnType<typeof getSubscription>>;
  purchases: Awaited<ReturnType<typeof getPurchases>>;
  userLimit: UserLimit;
  userUsage: UserUsage;
  graphData: GraphData[];
};

function ClientPage({
  subscription,
  purchases,
  userLimit,
  userUsage,
  graphData,
}: Props) {
  const router = useRouter();

  return (
    <MaxWidthWrapper className="flex flex-col-reverse w-full gap-2 lg:grid lg:items-start lg:grid-cols-3 lg:space-x-3 pt-8 px-2.5 md:px-3 lg:px-20">
      <div className="lg:col-span-2 grid space-y-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-900">
              {subscription.isSubscribed
                ? "Current month usage"
                : "Limited plan usage"}
            </CardTitle>
            <CardDescription>
              Your <span className="font-bold">{subscription.name}</span> plan
              resources usage
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-zinc-900">
              Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={graphData} />
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full space-y-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-900">
              Plan limits
            </CardTitle>
            <CardDescription>
              Your <span className="font-bold">{subscription.name}</span> plan
              resource limits
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-2">
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
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-900">
              Purchases
            </CardTitle>
            <CardDescription>
              Your recent purchases ({purchases.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {purchases.length > 0 && (
              <ScrollArea className="h-40 rounded-md border">
                <div className="p-4 flex flex-col space-y-2">
                  {purchases.map((purchase, index) => (
                    <PurchaseCard purchase={purchase} key={index} />
                  ))}
                </div>
              </ScrollArea>
            )}
            {purchases.length === 0 && (
              <div className="h-40 rounded-md flex flex-col items-center justify-center space-y-2 border">
                <p className="text-sm leading-tight">No purchase available</p>
                <Button onClick={() => router.push("/upgrade")} size="sm">
                  Upgrade
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}

export default ClientPage;
