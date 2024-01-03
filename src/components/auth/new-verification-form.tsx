"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/auth/new-verification";
import { PulseLoader } from "react-spinners";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setsuccess] = useState<string | undefined>(undefined);

  const searchParms = useSearchParams();
  const code = searchParms.get("code");

  const onSubmit = useCallback(() => {
    if (error || success) return;

    if (!code) {
      setError("Invalid request");
      return;
    }

    newVerification(code)
      .then((data) => {
        setError(data.error);
        setsuccess(data.success);
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [code, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        {!error && !success && <PulseLoader className="animate-pulse" />}
        {!!success && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
