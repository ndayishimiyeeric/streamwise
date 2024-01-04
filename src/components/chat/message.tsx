import React, { forwardRef } from "react";
import Link from "next/link";
import { getSubscription } from "@/data/user";
import { AiData } from "@prisma/client";
import { format } from "date-fns";

import { ExtendedMessage } from "@/types/message";
import { cn } from "@/lib/utils";
import BotAvatar from "@/components/ui/bot-avatar";
import UserAvatar from "@/components/ui/user-avatar";

import MarkdownComponent from "../markdown-component";

type Props = {
  userName: string;
  imageUrl: string;
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
  aiData: AiData;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

const Message = forwardRef<HTMLDivElement, Props>(
  ({ imageUrl, userName, message, isNextMessageSamePerson, aiData, subscriptionPlan }, ref) => {
    return (
      <div className={cn("flex items-start px-8 py-4")} ref={ref}>
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
        <div className={cn("mx-2 flex w-full flex-col items-start space-y-2 text-base")}>
          <div className={cn("inline-block rounded-lg px-4")}>
            {!message.isUserMessage && (
              <Link href="/my-ai" className="text-sm font-semibold text-primary">
                {aiData.name}
              </Link>
            )}
            {message.isUserMessage && (
              <p className="text-sm font-semibold text-primary">{userName}</p>
            )}
            {typeof message.text === "string" ? (
              <MarkdownComponent code={message.text} />
            ) : (
              message.text
            )}
          </div>
          {message.id !== "loading" && (
            <div className={cn("w-full select-none text-right text-xs")}>
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
