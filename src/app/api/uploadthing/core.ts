import { auth } from "@/auth";
import { TRPCError } from "@trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    throw new Error("Not authenticated");
  }

  const isAllowed = true;

  if (!isAllowed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You have reached the limit of your prompt plan usage",
      cause: "You have reached the limit of your prompt plan usage",
    });
  }

  return { userId: session.user.id };
};

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileCount: 1,
    },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {}),

  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
