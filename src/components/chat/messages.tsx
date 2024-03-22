import React, { useContext, useEffect, useRef } from "react";
import { getSubscription } from "@/data/subscriptions";
import { useIntersection } from "@mantine/hooks";
import { AiData } from "@prisma/client";
import { Loader2, MessageSquare } from "lucide-react";

import Message from "@/components/chat/message";
import { ChatContext } from "@/components/hoc/chat-context";
import { trpc } from "@/app/_trpc/client";

import MaxWidthWrapper from "../max-width-wrapper";

type Props = {
  userName: string;
  imageUrl: string;
  fileId: string;
  aiData: AiData;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

function Messages({ imageUrl, userName, fileId, aiData, subscriptionPlan }: Props) {
  const { data, isLoading, fetchNextPage } = trpc.getFileMessages.useInfiniteQuery(
    {
      fileId,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      keepPreviousData: true,
    }
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
      <span className="z-0 flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [...(isAiThinking ? [loadingMessage] : []), ...(messages ?? [])];

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto p-3">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, index) => {
          const isNextMessageSameUser =
            combinedMessages[index - 1]?.isUserMessage === message.isUserMessage;

          if (index === combinedMessages.length - 1) {
            return (
              <MaxWidthWrapper className="max-w-6xl" key={index}>
                <Message
                  ref={ref}
                  imageUrl={imageUrl}
                  userName={userName}
                  message={message}
                  isNextMessageSamePerson={isNextMessageSameUser}
                  aiData={aiData}
                  subscriptionPlan={subscriptionPlan}
                />
              </MaxWidthWrapper>
            );
          } else
            return (
              <MaxWidthWrapper className="max-w-6xl">
                <Message
                  key={index}
                  userName={userName}
                  imageUrl={imageUrl}
                  message={message}
                  isNextMessageSamePerson={isNextMessageSameUser}
                  aiData={aiData}
                  subscriptionPlan={subscriptionPlan}
                />
              </MaxWidthWrapper>
            );
        })
      ) : isLoading ? (
        <div className="flex w-full flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <p className="text-xl font-semibold">You&apos;re all set!</p>
          <p className="text-sm text-zinc-500">Ask your first question to get started.</p>
        </div>
      )}
    </div>
  );
}

export default Messages;
