"use server";

import {
  convertPdfToDocuments,
  deletePages,
  getFileByIdAndUserId,
  loadFileFromUrl,
} from "@/data/files";

import { currentUser } from "@/lib/auth";
import { createSafeAction } from "@/lib/create-safe-action";

import { ProcessFile } from "./schema";
import { InputType, OutputType } from "./types";

const handler = async (data: InputType): Promise<OutputType> => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }
  const { url, fileId, name, pagesToDelete } = data;

  const dbFile = await getFileByIdAndUserId(fileId, user.id);

  if (!dbFile) {
    return {
      error: "File not found",
    };
  }

  let fileAsBuffer = await loadFileFromUrl(url);
  console.log(fileAsBuffer);
  if (pagesToDelete && pagesToDelete.length > 0) {
    fileAsBuffer = await deletePages(fileAsBuffer, pagesToDelete);
  }

  const documents = await convertPdfToDocuments(fileAsBuffer);
  console.log(documents);
  return { data: dbFile };
};

export const processFile = createSafeAction(ProcessFile, handler);
