"use server";

import { deleteCollectionIfExists, getFileByIdAndUserId } from "@/data/files";
import { utapi } from "@/server/uploadthing";

import { currentUser } from "@/lib/auth";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { DeleteFile } from "./schema";
import { InputType, OutputType } from "./types";

const handler = async (data: InputType): Promise<OutputType> => {
  const session_user = await currentUser();

  if (!session_user) {
    return {
      error: "Not authenticated",
    };
  }

  const file = await getFileByIdAndUserId(data.id, session_user.id);
  if (!file) {
    return {
      error: "File not found",
    };
  }

  await utapi.deleteFiles(file.key);
  await deleteCollectionIfExists(file.correctionId);

  const deletedFile = await db.file.delete({
    where: {
      id: file.id,
      userId: session_user.id,
    },
  });

  return {
    data: deletedFile,
  };
};

export const deleteFile = createSafeAction(DeleteFile, handler);
