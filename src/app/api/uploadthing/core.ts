import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { db } from "@/lib/db";
import { qdrantClient } from "@/lib/qdrant";
import {
  checkPdfUploadUsage,
  getFileChunks,
  getOrCreateCollectionIfNotExists,
} from "@/lib/actions";
import { getUserMaxFileLimit } from "@/lib/actions/user-usage-actions";
import { TRPCError } from "@trpc/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { getUser } = getKindeServerSession();
  const { id, email } = getUser();

  if (!id || !email) {
    throw new Error("Not authenticated");
  }

  const isAllowed = await checkPdfUploadUsage(id);

  if (!isAllowed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You have reached the limit of your prompt plan usage",
      cause: "You have reached the limit of your prompt plan usage",
    });
  }

  const userFileLimits = await getUserMaxFileLimit();

  return { userId: id, userFileLimits, email };
};

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileCount: 1,
    },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          userId: metadata.userId,
          name: file.name,
          key: file.key,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      // increase the upload usage
      await db.userUsage.update({
        where: {
          userId: metadata.userId,
        },
        data: {
          pdfUploadUsage: {
            increment: 1,
          },
        },
      });

      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        );
        const blob = await response.blob();
        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();
        const pages = pageLevelDocs.length;
        const fileSize = file.size / 1024 / 1024;

        if (
          fileSize > metadata.userFileLimits.maxFileSize ||
          pages > metadata.userFileLimits.maxPagesPdf
        ) {
          await db.file.update({
            where: {
              id: createdFile.id,
            },
            data: {
              uploadStatus: "FAILED",
            },
          });

          return;
        }

        const chunks = await getFileChunks(pageLevelDocs, pageLevelDocs.length);

        await getOrCreateCollectionIfNotExists(createdFile.id);

        // indexing and vectorised documents
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        await QdrantVectorStore.fromTexts(
          chunks,
          {
            documentId: createdFile.id,
          },
          embeddings,
          {
            apiKey: process.env.QDRANT_API_KEY!,
            client: qdrantClient,
            url: process.env.QDRANT_HOST!,
            collectionName: createdFile.id,
          },
        );

        await db.file.update({
          where: {
            id: createdFile.id,
          },
          data: {
            uploadStatus: "COMPLETED",
            pages,
          },
        });
      } catch (e) {
        console.log(e);
        await db.file.update({
          where: {
            id: createdFile.id,
          },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
    }),

  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
