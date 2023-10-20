import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { SendMessageSchema } from "@/lib/validators/message";
import { db } from "@/lib/db";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { openai } from "@/lib/openai";
import { formatConversation } from "@/lib/conversation";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { qdrantClient } from "@/lib/qdrant";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { getUser } = getKindeServerSession();
    const { id: userId } = getUser();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileId, message } = SendMessageSchema.parse(payload);

    const file = await db.file.findUnique({
      where: {
        id: fileId,
        userId,
      },
      include: {
        User: true,
      },
    });

    if (!file) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.message.create({
      data: {
        fileId,
        text: message,
        isUserMessage: true,
        userId,
      },
    });

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const vector_store = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_HOST!,
        apiKey: process.env.QDRANT_API_KEY!,
        collectionName: fileId,
        client: qdrantClient,
      },
    );

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
        userId,
      },
    });

    const messages = formatConversation(
      results,
      prevMessages,
      message,
      file.User.email,
      file.name,
      file.pages,
      {
        name: userAiData?.name,
        bio: userAiData?.bio || "",
      },
    );

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      temperature: 0,
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            fileId,
            text: completion,
            isUserMessage: false,
            userId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error("message route", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
