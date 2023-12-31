"use client";

import React from "react";
import { AiData } from "@prisma/client";
import Messages from "@/components/chat/messages";
import Link from "next/link";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";

import ChatInput from "@/components/chat/chat-input";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChatContextProvider } from "@/components/hoc/chat-context";
import { getSubscription } from "@/lib/actions";

type Props = {
  imageUrl: string;
  userName: string;
  fileId: string;
  aiData: AiData;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

function ChatWrapper({
  imageUrl,
  userName,
  fileId,
  aiData,
  subscriptionPlan,
}: Props) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { id: fileId },
    {
      refetchInterval: (data) =>
        data?.status === "COMPLETED" || data?.status === "FAILED" ? false : 500,
    },
  );

  if (isLoading)
    return (
      <ChatContextProvider fileId={fileId}>
        <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
          <div className="flex-1 flex justify-center items-center flex-col mb-28">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <h3 className="font-semibold text-xl">Loading...</h3>
              <p className="text-zinc-500 text-sm">PDF is being loaded</p>
            </div>
          </div>
          <ChatInput disabled />
        </div>
      </ChatContextProvider>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Processing...</h3>
            <p className="text-zinc-500 text-sm">This won&apos;t take a long</p>
          </div>
        </div>
        <ChatInput disabled />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-xl">Page Limit exceeded</h3>
            <p className="text-zinc-500 text-sm">
              <span className="font-semibold">Free</span> plan only 5 pages are
              supported
            </p>
            <Link href="/dashboard" className={cn(buttonVariants())}>
              <ChevronLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
        <ChatInput disabled />
      </div>
    );
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex flex-col justify-between mb-28">
          <Messages
            imageUrl={imageUrl}
            userName={userName}
            fileId={fileId}
            aiData={aiData}
            subscriptionPlan={subscriptionPlan}
          />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}

export default ChatWrapper;
