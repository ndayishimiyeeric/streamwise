"use client";

import React from "react";
import { AiData } from "@prisma/client";

import { getSubscription } from "@/lib/actions";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import BioForm from "@/app/dashboard/my-ai/_components/bio-form";
import NameForm from "@/app/dashboard/my-ai/_components/name-form";
import ImageForm from "@/app/dashboard/my-ai/_components/image-form";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  aiData: AiData;
};

function MyAiForm({ subscriptionPlan, aiData }: Props) {
  return (
    <MaxWidthWrapper className="max-w-6xl">
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="grid space-y-8">
          <NameForm subscriptionPlan={subscriptionPlan} aiData={aiData} />
          <ImageForm subscriptionPlan={subscriptionPlan} aiData={aiData} />
        </div>
        <BioForm subscriptionPlan={subscriptionPlan} aiData={aiData} />
      </div>
    </MaxWidthWrapper>
  );
}

export default MyAiForm;
