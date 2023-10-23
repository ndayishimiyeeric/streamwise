"use client";

import React, { useEffect, useState } from "react";
import { HiUser } from "react-icons/hi2";
import { Check, Loader2, Minus } from "lucide-react";

import { getSubscription } from "@/lib/actions";
import Modal from "@/components/ui/modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS, pricingItems } from "@/config/plans/plan";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";

type UpgradeModalProps = {
  subscription: Awaited<ReturnType<typeof getSubscription>>;
  isOpen: boolean;
  onClose: () => void;
};

function UpgradeModal({ subscription, isOpen, onClose }: UpgradeModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        window.location.href = url ?? "/dashboard/billing";
      },
    });

  if (!isMounted) return null;

  return (
    <Modal
      className="max-w-3xl"
      title="Upgrade your plan"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid sm:grid-cols-2">
        {PLANS.filter((p) => p.slug.toLowerCase() !== "free").map(
          (plan, index) => (
            <>
              <Card
                key={index}
                className={cn("rounded-none border-0 px-0 py-0 shadow-none", {
                  "border-r-2": index % 2 === 0,
                })}
              >
                <CardHeader className="pt-0">
                  <CardTitle className="flex items-center">
                    {plan.slug.toLowerCase() === "gold" && (
                      <HiUser className="fill-[#BF953F] mr-1" size={24} />
                    )}
                    <p className="text-2xl">{plan.name}</p>
                  </CardTitle>
                  <CardDescription className="text-xl">
                    EUR €{plan.price.amount}/month
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <Button
                    size="lg"
                    onClick={() => createStripeSession({ plan: plan.name })}
                    className={cn(
                      "w-full text-black font-bold focus-visible:ring-0 focus-visible:ring-offset-0",
                      {
                        "gradient-gold": plan.slug === "gold",
                        "gradient-silver": plan.slug === "silver",
                      },
                    )}
                    disabled={
                      subscription?.name?.toLowerCase() ===
                        plan.slug.toLowerCase() || isLoading
                    }
                  >
                    {subscription?.name?.toLowerCase() ===
                    plan.slug.toLowerCase() ? (
                      <>Your current plan</>
                    ) : (
                      <>
                        {isLoading && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Upgrade to {plan.name}
                      </>
                    )}
                  </Button>

                  <ul className="my-10 space-y-5 px-8">
                    {pricingItems
                      .filter(
                        (i) => i.plan.toLowerCase() === plan.slug.toLowerCase(),
                      )
                      .map((item) => {
                        return (
                          <>
                            {item.features.map(
                              ({ text, negative, footnote }, index) => (
                                <li key={index} className="flex space-x-5">
                                  <div className="flex-shrink-0">
                                    {negative ? (
                                      <Minus className="w-4 h-4 text-red-300" />
                                    ) : (
                                      <Check
                                        className={cn("w-4 h-4", {
                                          "text-[#BF953F]":
                                            item.plan === "Gold",
                                          "text-blue-500":
                                            item.plan === "Silver",
                                        })}
                                      />
                                    )}
                                  </div>
                                  {footnote ? (
                                    <div className="flex items-center space-x-1">
                                      <p
                                        className={cn(
                                          "text-base text-left md:text-sm text-gray-400",
                                          {
                                            "text-gray-600": negative,
                                          },
                                        )}
                                      >
                                        {text}
                                      </p>
                                    </div>
                                  ) : null}
                                </li>
                              ),
                            )}
                          </>
                        );
                      })}
                  </ul>
                </CardContent>
              </Card>
            </>
          ),
        )}
      </div>
    </Modal>
  );
}

export default UpgradeModal;
