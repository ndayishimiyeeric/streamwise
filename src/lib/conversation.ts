import { Message } from "@prisma/client";
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
export const formatConversation = (
  results: Record<string, any>[],
  prevMessages: Message[],
  newMessage: string,
) => {
  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? "user" : "assistant",
    content: message.text,
  })) as ChatCompletionMessageParam[];

  return [
    {
      role: "system",
      content:
        "Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.",
    },
    {
      role: "user",
      content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${newMessage}`,
    },
  ] as ChatCompletionMessageParam[];
};
