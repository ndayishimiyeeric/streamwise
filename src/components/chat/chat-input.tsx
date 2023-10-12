import React, { useContext } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatContext } from "@/components/hoc/chat-context";

type Props = {
  disabled?: boolean;
};

function ChatInput({ disabled }: Props) {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                placeholder="Enter your message..."
                rows={1}
                maxRows={4}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    addMessage();
                    textAreaRef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
                value={message}
                ref={textAreaRef}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
              />
              <Button
                aria-label="send message"
                className="absolute bottom-1.5 right-[8px]"
                size="icon"
                disabled={disabled || isLoading}
                onClick={(e) => {
                  addMessage();
                  textAreaRef.current?.focus();
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
