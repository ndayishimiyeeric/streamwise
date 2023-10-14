"use client";

import React from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

function BillingForm({ subscriptionPlan }: Props) {
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
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your subscription will be ended on "
                  : "Your subscription will be renewed on "}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
                .
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
}

export default BillingForm;
