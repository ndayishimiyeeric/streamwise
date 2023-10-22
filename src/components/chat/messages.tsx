import React, { useContext, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Loader2, MessageSquare } from "lucide-react";
import { useIntersection } from "@mantine/hooks";
import { AiData } from "@prisma/client";

import { trpc } from "@/app/_trpc/client";
import { QUERY_LIMIT } from "@/config/user-usage";
import Message from "@/components/chat/message";
import { ChatContext } from "@/components/hoc/chat-context";
import { getSubscription } from "@/lib/actions";

type Props = {
  userName: string;
  imageUrl: string;
  fileId: string;
  aiData: AiData;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

function Messages({
  imageUrl,
  userName,
  fileId,
  aiData,
  subscriptionPlan,
}: Props) {
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      },
    );

  const { isLoading: isAiThinking } = useContext(ChatContext);

  const messages = data?.pages.flatMap((page) => page.messages);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage().then((r) => r);
    }
  }, [entry, fetchNextPage]);

  const loadingMessage = {
    id: "loading",
    createdAt: new Date().toISOString(),
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center z-0">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, index) => {
          const isNextMessageSameUser =
            combinedMessages[index - 1]?.isUserMessage ===
            message.isUserMessage;

          if (index === combinedMessages.length - 1) {
            return (
              <Message
                key={index}
                ref={ref}
                imageUrl={imageUrl}
                userName={userName}
                message={message}
                isNextMessageSamePerson={isNextMessageSameUser}
                aiData={aiData}
                subscriptionPlan={subscriptionPlan}
              />
            );
          } else
            return (
              <Message
                key={index}
                userName={userName}
                imageUrl={imageUrl}
                message={message}
                isNextMessageSamePerson={isNextMessageSameUser}
                aiData={aiData}
                subscriptionPlan={subscriptionPlan}
              />
            );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <p className="font-semibold text-xl">You&apos;re all set!</p>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default Messages;
