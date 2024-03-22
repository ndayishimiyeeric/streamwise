import { Message } from "@prisma/client";
import OpenAI from "openai";

import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export const formatConversation = (
  results: Record<string, any>[],
  prevMessages: Message[],
  newMessage: string,
  fileOwnerName: string,
  fileName: string,
  filePages: number,
  userAiData: {
    name?: string;
    bio: string;
  }
) => {
  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? "user" : "assistant",
    content: message.text,
  })) as ChatCompletionMessageParam[];

  return [
    {
      role: "system",
      content: `You are an AI Assistant Assisting user with their pdf document. at streamwise

      Here is the Details of PDF file.
      PDF FILE NAME: ${fileName}
      PDF FILE PAGES: ${filePages}
      PDF FILE CONTENT:
      ${results.map((r) => r.pageContent).join("\n\n")}

      Use the pdf content to assist the user.
      this is how the user want you to behave:
      ${userAiData.bio}

      Your previous conversation with the user:
      PREVIOUS CONVERSATION
      ${formattedPrevMessages.map((message) => {
        if (message.role === "user") return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })}

      answer user questions in a rich markdown format only.

      the user asks you the following question:
      ${newMessage}
      `,
    },
  ] as ChatCompletionMessageParam[];
};
