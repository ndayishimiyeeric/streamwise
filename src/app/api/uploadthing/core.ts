import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";

const f = createUploadthing();

const handleAuth = async () => {
  const { getUser } = getKindeServerSession();
  const { id, email } = getUser();

  if (!id || !email) {
    throw new Error("Not authenticated");
  }

  return { userId: id, email };
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
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
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
