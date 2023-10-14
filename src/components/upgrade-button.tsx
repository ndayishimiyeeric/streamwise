"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

type Props = {
  plan: "Free" | "Silver" | "Gold";
};

function UpgradeButton({ plan }: Props) {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });
  return (
    <Button
      onClick={() => createStripeSession({ plan: plan })}
      className={cn("w-full text-black font-semibold", {
        "gradient-gold": plan === "Gold",
        "gradient-silver": plan === "Silver",
      })}
    >
      Upgrade now <ArrowRight className="w-5 h-5 ml-1.5" />
    </Button>
  );
}

export default UpgradeButton;
