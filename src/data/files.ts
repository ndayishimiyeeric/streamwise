import { ApiError } from "@qdrant/openapi-typescript-fetch";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";

import { db } from "@/lib/db";
import { qdrantClient } from "@/lib/qdrant";

export const processFile = async (url: string, size: number) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const loader = new PDFLoader(blob);

  const pageLevelDocs = await loader.load();
  const numPages = pageLevelDocs.length;
  const fileSize = size / 1024 / 1024;
  const data = { pageLevelDocs, numPages, fileSize };
  return data;
};

export const getFileChunks = async (
  document: Record<string, any>[],
  len: number
): Promise<string[]> => {
  const text_splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 200,
    chunkOverlap: 80,
    lengthFunction: (text) => text.length,
  });

  const chunks: string[] = [];
  let i = 0;
  while (i < len) {
    const text = document[i].pageContent.replace(/\n/gm, " ");
    const chunk = await text_splitter.splitText(text);
    chunks.push(...chunk);
    i++;
  }
  console.log("chunks", chunks);
  return chunks;
};

export const getOrCreateCollectionIfNotExists = async (correctionId: string) => {
  try {
    return await qdrantClient.getCollection(correctionId);
  } catch (error) {
    if (error instanceof ApiError) {
      await qdrantClient.createCollection(correctionId, {
        vectors: {
          size: 1536,
          distance: "Cosine",
        },
      });

      return await qdrantClient.getCollection(correctionId);
    }
  }
};

export const deleteCollectionIfExists = async (correctionId: string) => {
  try {
    const isDeleted = await qdrantClient.deleteCollection(correctionId);
    return isDeleted;
  } catch {
    return false;
  }
};

export const generateEmbeddings = async (
  chunks: string[],
  correctionId: string,
  documentId?: string
) => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  await QdrantVectorStore.fromTexts(
    chunks,
    {
      documentId: documentId,
    },
    embeddings,
    {
      apiKey: process.env.QDRANT_API_KEY!,
      client: qdrantClient,
      url: process.env.QDRANT_HOST!,
      collectionName: correctionId,
    }
  );
};

export const getFileById = async (id: string) => {
  try {
    const file = await db.file.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    return file;
  } catch {
    return null;
  }
};

export const getFileByIdAndUserId = async (id: string, userId: string) => {
  try {
    const file = await db.file.findUnique({
      where: {
        id,
        userId,
      },
    });
    return file;
  } catch {
    return null;
  }
};

export const getUserFilesAndMessageById = async (userId: string) => {
  const data = await db.file.findMany({
    where: {
      userId,
    },
    include: {
      messages: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};
