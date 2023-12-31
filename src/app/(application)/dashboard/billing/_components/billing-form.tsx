"use client";

import React, { useEffect, useState } from "react";
import getSubscription from "@/lib/actions/getSubscription";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import format from "date-fns/format";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarCheck, CalendarX, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

function BillingForm({ subscriptionPlan }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          window.location.href = url;
        }

        if (!url) {
          toast.error("Something went wrong");
        }
      },
    });
  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return null;
  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          if (isLoading) return;

          if (subscriptionPlan.isSubscribed) {
            createStripeSession({ plan: subscriptionPlan.slug! });
          } else {
            router.push("/pricing");
          }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription plan</CardTitle>
            <CardDescription>
              You are currently on a <strong>{subscriptionPlan.name}</strong>{" "}
              plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            {subscriptionPlan.isSubscribed && (
              <Button
                type="submit"
                className={cn("text-black font-semibold", {
                  "gradient-gold": subscriptionPlan.name === "Gold",
                  "gradient-silver": subscriptionPlan.name === "Silver",
                })}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Manage subscription
              </Button>
            )}
            {!subscriptionPlan.isSubscribed && (
              <Button type="submit">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Subscribe
              </Button>
            )}
            {subscriptionPlan.isSubscribed && (
              <TooltipProvider>
                <Button
                  className={cn("justify-start text-left font-normal gap-2", {
                    "pointer-events-none": !subscriptionPlan.isCanceled,
                  })}
                  variant="secondary"
                  type="button"
                >
                  {subscriptionPlan.isCanceled ? (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <CalendarX className="w-4 h-4 text-red-600" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2 flex items-center space-x-1">
                        <p className="text-left">
                          Your subscription is canceled.
                        </p>

                        <Link
                          className={cn(
                            buttonVariants({
                              variant: "link",
                              size: "sm",
                              className: "p-0",
                            }),
                          )}
                          href="/upgrade"
                        >
                          Options
                        </Link>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  )}
                  {format(
                    subscriptionPlan.stripeCurrentPeriodEnd!,
                    "dd.MM.yyyy",
                  )}
                  .
                </Button>
              </TooltipProvider>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
}

export default BillingForm;
