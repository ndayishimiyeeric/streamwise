"use client";

import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";

export const Social = () => {
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callBackUrl");

  const onClick = (provider: "google" | "discord") => {
    signIn(provider, { callbackUrl: callBackUrl || DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex w-full items-center gap-x-4">
      <Button
        size="lg"
        className="w-full items-center gap-x-2 rounded-full py-6"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5 flex-shrink-0" />
        <p className="hidden md:block">Google</p>
      </Button>
      <Button
        size="lg"
        className="w-full items-center gap-x-2 rounded-full py-6"
        variant="outline"
        onClick={() => onClick("discord")}
      >
        <FaDiscord className="h-5 w-5 flex-shrink-0 text-[#5865F2]" />
        <p className="hidden md:block">Discord</p>
      </Button>
    </div>
  );
};
