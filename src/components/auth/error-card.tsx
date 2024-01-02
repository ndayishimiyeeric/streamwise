"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Social } from "@/components/auth/social";

export const ErrorCard = () => {
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
