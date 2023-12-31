import React, { useContext } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatContext } from "@/components/hoc/chat-context";

type Props = {
  disabled?: boolean;
};

function ChatInput({ disabled }: Props) {
  const { addMessage, handleInputChange, isLoading, message } = useContext(ChatContext);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full bg-background">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex w-full flex-grow flex-col p-4">
            <div className="relative">
              <Textarea
                placeholder="Enter your message..."
                disabled={disabled || isLoading}
                rows={1}
                maxRows={4}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textAreaRef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
                value={message}
                ref={textAreaRef}
                className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch resize-none py-3 pr-12 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                aria-label="send message"
                className="absolute bottom-1.5 right-[8px]"
                size="icon"
                variant="ghost"
                disabled={disabled || isLoading || !message}
                onClick={(e) => {
                  addMessage();
                  textAreaRef.current?.focus();
                }}
              >
                <Send className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
