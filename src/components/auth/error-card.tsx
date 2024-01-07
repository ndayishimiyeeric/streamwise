"use client";

import { notFound, useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Social } from "@/components/auth/social";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  if (!searchParams.get("error")) return notFound();
  return (
    <CardWrapper
      headerLabel="Something went wrong"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Social />
    </CardWrapper>
  );
};
