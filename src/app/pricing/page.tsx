import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";

import { PLANS, pricingItems } from "@/config/plans/plan";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import UpgradeButton from "@/components/upgrade-button";

async function Page() {
  const session = await auth();

  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 max-w-5xl text-center lg:max-w-7xl">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            We&apos;ve got you covered. Choose the plan that&apos;s right for you. whether
            you&apos;re just trying out streamwise or you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-2 lg:grid-cols-3">
          <TooltipProvider>
            {pricingItems.map((plan, index) => {
              const price =
                PLANS.find((p) => p.slug.toLowerCase() === plan.plan.toLowerCase())?.price.amount ??
                0;
              return (
                <div
                  key={index}
                  className={cn("relative rounded-2xl bg-white shadow-lg", {
                    "border-2 border-[#BF953F] shadow-[#BF953F]": plan.plan === "Gold",
                    "border-2 border-[#B2B1B9] shadow-[#B2B1B9]": plan.plan === "Silver",
                    "border border-gray-200": plan.plan === "Free",
                  })}
                >
                  {plan.plan === "Gold" ? (
                    <div className="gradient-gold absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full px-3 py-2 text-sm font-bold text-black">
                      Upgrade
                    </div>
                  ) : (
                    plan.plan === "Silver" && (
                      <div className="gradient-silver absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full px-3 py-2 text-sm font-bold text-black">
                        Upgrade
                      </div>
                    )
                  )}

                  <div className="p-5">
                    <h3 className="font-display my-3 text-center text-3xl font-bold">
                      {plan.plan}
                    </h3>
                    <p className="text-gray-500">{plan.tagline}</p>
                    <p className="font-display my-5 text-5xl font-semibold">
                      €{price}
                      <span className="text-xl font-normal"> / mo</span>
                    </p>
                  </div>

                  <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <p>{plan.quota.toLocaleString()} PDFs/mo included</p>

                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="ml-1.5 cursor-default">
                          <HelpCircle className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          PDFs you can upload per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ul className="my-10 space-y-5 px-8">
                    {plan.features.map(({ text, negative, footnote }, index) => (
                      <li key={index} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="h-4 w-4 text-red-300" />
                          ) : (
                            <Check
                              className={cn("h-4 w-4", {
                                "text-[#BF953F]": plan.plan === "Gold",
                                "text-blue-500": plan.plan === "Silver",
                                "text-[#B2B1B9]": plan.plan === "Free",
                              })}
                            />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn("text-left text-base text-gray-400 md:text-sm", {
                                "text-gray-600": negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="ml-1.5 cursor-default">
                                <HelpCircle className="h-4 w-4 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">{footnote}</TooltipContent>
                            </Tooltip>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>

                  <div className=" border-t border-gray-200" />

                  <div className="p-5">
                    {plan.plan === "Free" ? (
                      <Link
                        className={buttonVariants({
                          className: "w-full",
                          variant: "secondary",
                        })}
                        href={session?.user.id ? "/dashboard" : "/sign-in"}
                      >
                        {session?.user.id ? "Dashboard" : "Get started"}
                        <ArrowRight className="ml-1.5 h-5 w-5" />
                      </Link>
                    ) : session?.user.id ? (
                      <UpgradeButton plan={plan.plan === "Gold" ? "Gold" : "Silver"} />
                    ) : (
                      <Link className={buttonVariants({ className: "w-full" })} href="/sign-in">
                        Get started
                        <ArrowRight className="ml-1.5 h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
}

export default Page;
