import Image from "next/image";
import { getActiveProductsWithPrices } from "@/data/subscriptions";
import { FaArrowRight } from "react-icons/fa";

import { Pricing as PricingTable } from "@/components/billing/pricing";

import { SectionHeader } from "../section-header";

export const Pricing = async () => {
  const products = await getActiveProductsWithPrices();

  return (
    <>
      <section className="container overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `PRICING PLANS`,
                subtitle: `Pricing`,
                description: `We've got you covered. Choose the plan that's right for you. whether you're just trying out streamwise or you need more.`,
              }}
            />
          </div>
        </div>

        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <div className="absolute -bottom-15 -z-1 h-full w-full">
            <Image
              fill
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
            />
          </div>

          <PricingTable products={products} action="session" />
        </div>
      </section>
    </>
  );
};
