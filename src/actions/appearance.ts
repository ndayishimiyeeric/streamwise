"use server";

import { getUserById, getUserSettingsById } from "@/data/user";
import { AppearanceSchema } from "@/schemas";
import * as z from "zod";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const appearance = async (input: z.infer<typeof AppearanceSchema>) => {
  const session_user = await currentUser();
  if (!session_user) return { error: "Unauthorized" };
  const user = await getUserById(session_user.id);
  if (!user) return { error: "Unauthorized" };
  const user_settings = await getUserSettingsById(user.id);
  if (!user_settings) return { error: "Unauthorized" };

  await db.userSettings.update({
    where: { id: user_settings.id },
    data: { ...input },
  });

  return { success: "Settings updated" };
};
