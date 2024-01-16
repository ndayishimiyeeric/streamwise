"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortalLink } from "@/actions/stripe/createPortal";
import { createStripeSession } from "@/actions/stripe/createSession";
import { getActiveProductsWithPrices } from "@/data/subscriptions";
import { PricingPlanInterval } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";

import { PriceWithQuantity } from "@/types";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";

import { PriceItem } from "./price-item";

interface PricingProps {
  products: Awaited<ReturnType<typeof getActiveProductsWithPrices>>;
  action: "session" | "portal";
  className?: string;
  displayFree?: boolean;
}

export const Pricing = ({ products, action, className, displayFree }: PricingProps) => {
  const [billingInterval, setBillingInterval] = useState<PricingPlanInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string | null>(null);

  const router = useRouter();
  const user = useCurrentUser();
  const intervals = Array.from(
    new Set(products.flatMap((product) => product.prices?.map((price) => price?.interval)))
  );
  const sortedProducts = products.sort((a, b) => {
    const aPrice = a.prices?.find((price) => price.interval === billingInterval);
    const bPrice = b.prices?.find((price) => price.interval === billingInterval);
    if (!aPrice || !bPrice) return 0;
    return (aPrice.unitAmount || 0) - (bPrice.unitAmount || 0);
  });

  const { execute: createSession, isLoading: createLoading } = useAction(createStripeSession, {
    async onSuccess(data) {
      router.push(data.url);
    },
    onError(error) {
      toast.error(error);
    },
    onCompleted() {
      setPriceIdLoading(null);
    },
  });

  const { execute: createLink, isLoading: createLinkLoading } = useAction(createPortalLink, {
    onSuccess(data) {
      router.push(data.url);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const handleAction = async (price: PriceWithQuantity) => {
    switch (action) {
      case "session":
        setPriceIdLoading(price.id);
        if (!user) {
          return router.push("/auth/login");
        }

        if (user.subscription) {
          return router.push("/manage");
        }

        createSession(price);
        break;
      case "portal":
        if (!user) {
          return router.push("/auth/login");
        }
        createLink({});
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-6">
      <div>
        <Button
          size="sm"
          className={cn("cursor-pointer", intervals.includes("month") && "rounded-r-none")}
          onClick={() => setBillingInterval("month")}
          variant={billingInterval === "month" ? "default" : "secondary"}
          disabled={createLoading || createLinkLoading || priceIdLoading !== null}
        >
          Monthly billing
        </Button>
        <Button
          size="sm"
          className={cn("cursor-pointer", intervals.includes("year") && "rounded-l-none")}
          onClick={() => setBillingInterval("year")}
          variant={billingInterval === "year" ? "default" : "secondary"}
          disabled={createLoading || createLinkLoading || priceIdLoading !== null}
        >
          Yearly billing
        </Button>
      </div>
      <div
        className={cn(
          "grid grid-cols-1 place-items-center gap-7.5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  xl:gap-12.5",
          className
        )}
      >
        {displayFree && (
          <PriceItem interval={billingInterval}>
            <button
              aria-label="Get the Plan button"
              className="group/btn inline-flex items-center gap-2.5 font-medium text-primary transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:text-primary"
              onClick={() => {
                if (user) {
                  return router.push("/dashboard");
                } else {
                  return router.push("/auth/login");
                }
              }}
              disabled={createLoading || createLinkLoading || priceIdLoading !== null}
            >
              <span className="duration-300 group-hover/btn:pr-2">
                {user ? "Dashboard" : "Sign up"}
              </span>
              {createLinkLoading && createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {!createLinkLoading && !createLoading && <FaArrowRight className="h-4 w-4" />}
            </button>
          </PriceItem>
        )}
        {sortedProducts.map((product, idx) => {
          const prices = product.prices?.filter((price) => price.interval === billingInterval);
          return prices.map((price) => (
            <PriceItem key={idx} price={price} product={product}>
              <button
                aria-label="Get the Plan button"
                className="group/btn inline-flex items-center gap-2.5 font-medium text-primary transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:text-primary"
                disabled={createLoading || createLinkLoading || priceIdLoading !== null}
                onClick={() => handleAction({ ...price, quantity: 1 })}
              >
                <span className="duration-300 group-hover/btn:pr-2">
                  {user ? "Manage" : "Sign up"}
                </span>
                {!createLinkLoading && !createLoading && <FaArrowRight className="h-4 w-4" />}
                {createLinkLoading && createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </button>
            </PriceItem>
          ));
        })}
      </div>
    </div>
  );
};
