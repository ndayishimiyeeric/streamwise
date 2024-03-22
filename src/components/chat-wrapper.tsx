"use client";

import React from "react";
import Link from "next/link";
import { getSubscription } from "@/data/user";
import { AiData } from "@prisma/client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ChatInput from "@/components/chat/chat-input";
import Messages from "@/components/chat/messages";
import { ChatContextProvider } from "@/components/hoc/chat-context";
import { trpc } from "@/app/_trpc/client";

type Props = {
  imageUrl: string;
  userName: string;
  fileId: string;
  aiData: AiData;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

function ChatWrapper({ imageUrl, userName, fileId, aiData, subscriptionPlan }: Props) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { id: fileId },
    {
      refetchInterval: (data) =>
        data?.status === "COMPLETED" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading)
    return (
      <ChatContextProvider fileId={fileId}>
        <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y">
          <div className="mb-28 flex flex-1 flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <h3 className="text-xl font-semibold">Loading...</h3>
              <p className="text-sm">PDF is being loaded</p>
            </div>
          </div>
          <ChatInput disabled />
        </div>
      </ChatContextProvider>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <h3 className="text-xl font-semibold">Processing...</h3>
            <p className="text-sm">This won&apos;t take a long</p>
          </div>
        </div>
        <ChatInput disabled />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">Error</h3>
            <p className="text-sm">
              <span className="font-semibold">Failed to process file</span>
            </p>
            <Link href="/dashboard" className={cn(buttonVariants())}>
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>
        <ChatInput disabled />
      </div>
    );
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex  min-h-full flex-col justify-between gap-2 divide-y">
        <div className="mb-28 flex flex-1 flex-col justify-between">
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
