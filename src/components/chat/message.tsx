import React, { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { AiData } from "@prisma/client";

import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { Icons } from "@/components/icons";
import { getSubscription } from "@/lib/actions";
import BotAvatar from "@/components/ui/bot-avatar";
import Link from "next/link";
import UserAvatar from "@/components/ui/user-avatar";

type Props = {
  userName: string;
  imageUrl: string;
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
  aiData: AiData;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

const Message = forwardRef<HTMLDivElement, Props>(
  (
    {
      imageUrl,
      userName,
      message,
      isNextMessageSamePerson,
      aiData,
      subscriptionPlan,
    },
    ref,
  ) => {
    return (
      <div
        className={cn("flex items-start px-8 py-4", {
          "bg-[#fff]": message.isUserMessage,
        })}
        ref={ref}
      >
        <div>
          {message.isUserMessage ? (
            <UserAvatar
              imageUrl={imageUrl}
              userName={userName}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          ) : (
            <BotAvatar
              aiData={aiData}
              subscriptionPlan={subscriptionPlan}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          )}
        </div>
        <div
          className={cn(
            "flex flex-col space-y-2 text-base w-full mx-2 items-start",
          )}
        >
          <div className={cn("px-4 rounded-lg inline-block")}>
            {!message.isUserMessage && (
              <Link
                href="/dashboard/my-ai"
                className="text-sm font-semibold text-primary"
              >
                {aiData.name}
              </Link>
            )}
            {message.isUserMessage && (
              <p className="text-sm font-semibold text-indigo-400">Me</p>
            )}
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose mt-2", {
                  // "text-zinc-50": message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
          </div>
          {message.id !== "loading" && (
            <div
              className={cn("text-xs select-none w-full text-right", {
                "text-zinc-500": !message.isUserMessage,
                "text-zinc-400": message.isUserMessage,
              })}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Message.displayName = "Message";

export default Message;
