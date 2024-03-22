"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/auth/new-verification";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  if (error || success) {
    toast("Verification status", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
          <code className="text-primary-foreground">
            {JSON.stringify({ error: error || undefined, success: success || undefined }, null, 2)}
          </code>
        </pre>
      ),
      duration: 10000,
    });
  }

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        {!error && !success && <Loader2 className="h-5 w-6 animate-spin" />}
        {!!success && error && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
