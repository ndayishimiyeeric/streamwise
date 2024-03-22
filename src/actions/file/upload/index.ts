"use server";

import { revalidatePath } from "next/cache";
import {
  generateEmbeddings,
  getFileChunks,
  getOrCreateCollectionIfNotExists,
  processFile,
} from "@/data/files";
import { utapi } from "@/server/uploadthing";
import { v4 as uuidv4 } from "uuid";

import { currentUser } from "@/lib/auth";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { UploadFile } from "./schema";
import { InputType, OutputType } from "./types";

const handler = async (data: InputType): Promise<OutputType> => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const { url, key, size, name } = data;

  const file = await utapi.getFileUrls(key);

  if (!file[0]) {
    return {
      error: "File not found",
    };
  }

  const { pageLevelDocs, numPages, fileSize } = await processFile(url, size);
  // const chunks = await getFileChunks(pageLevelDocs, numPages);
  const correctionId = uuidv4();
  // await getOrCreateCollectionIfNotExists(correctionId);

  const dbFile = await db.file.create({
    data: {
      userId: user.id,
      name,
      correctionId,
      key,
      pages: numPages,
      url: file[0].url,
      uploadStatus: "PENDING",
      size: fileSize,
    },
  });

  // await generateEmbeddings(chunks, correctionId);
  revalidatePath(`/dashboard/${dbFile.id}`);
  revalidatePath(`/dashboard`);
  return { data: dbFile };
};

export const uploadFile = createSafeAction(UploadFile, handler);
