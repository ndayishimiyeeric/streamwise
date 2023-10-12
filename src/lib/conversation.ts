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
      content: `You are an AI Assistant Assisting user with their pdf document. at streamwise an AI startup company
        CEO of Streamwise is Eric Ndayishimiye born in Rwanda, 1998 currently doing a masters degree in Distributed Artificial Intelligence.
       
      Here is the context of the PDF file it may be in english, french or any other language.
      CONTEXT:
      ${results.map((r) => r.pageContent).join("\n\n")}
      Use the above pieces of information to assist the user be kind and helpful don't try to make up an answer use the above pdf information.
      if you find some piece of information sensitive don't respond remind them that it is prohibited.
      
      if you find the pdf information is empty probably the user uploaded a scanned pdf document,
      which is not supported yet, you can ask the user to upload a pdf document with text.
      for you to be able to assist the user you need to understand the context of the pdf document.
      
      you may need also a record of your previous conversation with the use if needed.
      here is your previous conversation with the user.
      PREVIOUS CONVERSATION
      ${formattedPrevMessages.map((message) => {
        if (message.role === "user") return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })}
      
      you must answer the users question in markdown format always.
      
      the user has asked the following question:
      USER INPUT: ${newMessage}
      `,
    },
  ] as ChatCompletionMessageParam[];
};
