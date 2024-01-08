"use client";

import { Price, Product } from "@prisma/client";

import { plans, PlanType } from "@/config/pricing";
import { cn, formatPrice } from "@/lib/utils";

interface PriceItemProps {
  product?: Product;
  price?: Price;
  interval?: string;
  children?: React.ReactNode;
}

export const PriceItem = ({ product, price, children, interval }: PriceItemProps) => {
  const productPlan =
    product && product.metadata && JSON.parse(JSON.stringify(product.metadata)).plan;
  const planType: PlanType =
    productPlan === "basic" ? "basic" : productPlan === "pro" ? "pro" : "basic";
  const plan = product ? plans.get(planType) : plans.get("hobby");
  const amount = price && formatPrice(price.unitAmount as number, price.currency);

  return (
    <div className="animate_top group relative rounded-lg border border-stroke bg-white p-7.5 shadow-solid-10 dark:border-muted dark:bg-card dark:shadow-none xl:p-12.5">
      {plan?.plan === "basic" && (
        <div className="absolute -right-3.5 top-12.5 -rotate-90 rounded-bl-full rounded-tl-full bg-primary px-4.5 py-1.5 text-metatitle font-medium uppercase text-white dark:text-black">
          Recommended
        </div>
      )}

      <h3 className="mb-7.5 text-3xl font-bold text-primary xl:text-sectiontitle3">
        {amount ? amount : "€0"}
        <span className="text-regular text-muted-foreground dark:text-manatee">
          /{price ? price.interval : interval ? interval : "month"}
        </span>
      </h3>
      <h4 className="mb-2.5 text-para2 font-medium text-black dark:text-white">
        {plan?.description}
      </h4>
      <p>{product ? product.description : "Streamwise Hobby features"}</p>

      <div className="mt-9 border-t pb-12.5 pt-9">
        <ul>
          {plan?.features.map((feature, idx) => (
            <li
              key={idx}
              className={cn(
                "mb-4 text-black opacity-40 last:mb-0 dark:text-manatee",
                feature.highlight && "opacity-100"
              )}
            >
              {feature.label}
            </li>
          ))}
        </ul>
      </div>

      {children && children}
    </div>
  );
};
