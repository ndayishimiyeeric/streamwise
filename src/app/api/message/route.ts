import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkPromptUsage, getSubscription, increasePromptUsage } from "@/data/user";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";

import { formatConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { qdrantClient } from "@/lib/qdrant";
import { SendMessageSchema } from "@/lib/validators/message";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const session = await auth();

    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileId, message } = SendMessageSchema.parse(payload);

    const file = await db.file.findUnique({
      where: {
        id: fileId,
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    if (!file) {
      return new NextResponse("Not found", { status: 404 });
    }

    const isAllowed = await checkPromptUsage(session.user.id);
    const subscription = await getSubscription(session.user.id);
    const isGold = subscription?.slug?.toLowerCase() === "gold";

    if (!isAllowed && !isGold) {
      return new NextResponse("You have reached the limit of your prompt plan usage", {
        status: 403,
      });
    }

    await db.message.create({
      data: {
        fileId,
        text: message,
        isUserMessage: true,
        userId: session.user.id,
      },
    });

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const vector_store = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_HOST!,
      apiKey: process.env.QDRANT_API_KEY!,
      collectionName: file.correctionId,
      client: qdrantClient,
    });

    const results = await vector_store.similaritySearch(message);
    const prevMessages = await db.message.findMany({
      where: {
        fileId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });

    const userAiData = await db.aiData.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    const messages = formatConversation(
      results,
      prevMessages,
      message,
      file.user.name || "",
      file.name,
      file.pages,
      {
        name: userAiData?.name,
        bio: userAiData?.bio || "",
      }
    );

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      temperature: 0,
      stream: true,
      messages,
    });

    // @ts-ignore
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            fileId,
            text: completion,
            isUserMessage: false,
            userId: session.user.id,
          },
        });
      },
    });

    if (!isGold) {
      await increasePromptUsage(session.user.id);
    }

    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error("message route", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
