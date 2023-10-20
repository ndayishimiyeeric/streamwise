"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";

function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        console.log("success");
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError: ({ message, data, shape }) => {
      if (data?.code === "UNAUTHORIZED") {
        router.push("/api/auth/login?");
      } else {
        router.push("/auth");
      }
    },
    retry: 3,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically</p>
      </div>
    </div>
  );
}

export default AuthCallbackPage;
