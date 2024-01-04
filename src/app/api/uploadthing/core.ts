import { auth } from "@/auth";
import { checkPdfUploadUsage, getUserMaxFileLimit } from "@/data/user";
import { TRPCError } from "@trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    throw new Error("Not authenticated");
  }

  const isAllowed = await checkPdfUploadUsage(session.user.id);

  if (!isAllowed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You have reached the limit of your prompt plan usage",
      cause: "You have reached the limit of your prompt plan usage",
    });
  }

  const userFileLimits = await getUserMaxFileLimit(session.user.id);

  return { userId: session.user.id, userFileLimits };
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
