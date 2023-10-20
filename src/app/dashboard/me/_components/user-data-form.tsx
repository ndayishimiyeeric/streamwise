"use client";

import React from "react";
import { User } from ".prisma/client";

import { getSubscription } from "@/lib/actions";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import NameForm from "./user-name-form";
import UserImageForm from "./user-image-form";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  data: User;
};

function UserDataForm({ subscriptionPlan, data }: Props) {
  return (
    <MaxWidthWrapper className="max-w-5xl">
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="grid space-y-8">
          {/*<NameForm subscriptionPlan={subscriptionPlan} aiData={aiData} />*/}
        </div>
        <UserImageForm subscriptionPlan={subscriptionPlan} data={data} />
      </div>
    </MaxWidthWrapper>
  );
}

export default UserDataForm;
