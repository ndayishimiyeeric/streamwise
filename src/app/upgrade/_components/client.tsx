"use client";

import React, { useEffect, useState } from "react";
import { getSubscription } from "@/lib/actions";
import { redirect } from "next/navigation";
import UpgradeModal from "@/components/upgrade-modal";

interface ClientPageProps {
  subscription: Awaited<ReturnType<typeof getSubscription>>;
}

function ClientPage({ subscription }: ClientPageProps) {
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    setOpen(true);
  }, []);

  if (!open) return redirect("/dashboard");

  return (
    <UpgradeModal
      subscription={subscription}
      isOpen={open}
      onClose={() => {
        setOpen(false);
        redirect("/dashboard");
      }}
    />
  );
}

export default ClientPage;
