import React, { createContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "@/app/_trpc/client";

type ChatContextProps = {
  addMessage: () => void;
  message: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<ChatContextProps>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const backupMessageRef = useRef("");

  const utils = trpc.useContext();

  const router = useRouter();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/upgrade");
        }
        throw new Error("Upgrade your plan to use this feature");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessageRef.current = message;
      setMessage("");

      // cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await utils.getFileMessages.cancel();

      // snapshot the previous value
      const previousMessages = utils.getFileMessages.getInfiniteData();

      // optimistically update to the new value
      utils.getFileMessages.setInfiniteData({ fileId, limit: 10 }, (old) => {
        if (!old) return { pages: [], pageParams: [] };

        let newPages = [...old.pages];

        let latestPage = newPages[0];

        latestPage.messages = [
          {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            text: message,
            isUserMessage: true,
          },
          ...latestPage.messages,
        ];

        newPages[0] = latestPage;

        return { ...old, pages: newPages };
      });

      setIsLoading(true);

      return {
        previousMessages: previousMessages?.pages.flatMap((page) => page.messages ?? []),
      };
    },

    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return router.refresh();
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let response = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;

        const chunk = decoder.decode(value);

        response += chunk;

        // append to the last message

        utils.getFileMessages.setInfiniteData({ fileId, limit: 10 }, (old) => {
          if (!old) return { pages: [], pageParams: [] };

          let isAiResponseCreated = old.pages.some((page) =>
            page.messages.some((message) => message.id === "ai-response")
          );

          let updatedPages = old.pages.map((page) => {
            if (page === old.pages[0]) {
              let latestMessages;

              if (!isAiResponseCreated) {
                latestMessages = [
                  {
                    id: "ai-response",
                    createdAt: new Date().toISOString(),
                    text: response,
                    isUserMessage: false,
                  },
                  ...page.messages,
                ];
              } else {
                latestMessages = page.messages.map((message) => {
                  if (message.id === "ai-response") {
                    return {
                      ...message,
                      text: response,
                    };
                  }
                  return message;
                });
              }

              return {
                ...page,
                messages: latestMessages,
              };
            }

            return page;
          });
          return { ...old, pages: updatedPages };
        });
      }
    },

    onError: async (_, __, context) => {
      setMessage(backupMessageRef.current);
      utils.getFileMessages.setData({ fileId }, { messages: context?.previousMessages ?? [] });
      await utils.getFileMessages.invalidate({ fileId });
    },

    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => sendMessage({ message });
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <ChatContext.Provider value={{ addMessage, message, handleInputChange, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};
