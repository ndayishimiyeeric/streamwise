"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { AccountSchema } from "@/schemas";
import bcryptjs from "bcryptjs";
import * as z from "zod";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationCode } from "@/lib/tokens";

export const updateSettings = async (input: z.infer<typeof AccountSchema>) => {
  const session_user = await currentUser();

  if (!session_user) return { error: "Unauthorized" };

  const user = await getUserById(session_user.id);

  if (!user) return { error: "Unauthorized" };

  if (session_user.isOAuth) {
    input.email = undefined;
    input.password = undefined;
    input.new_password = undefined;
    input.isTwoFactorEnabled = undefined;
  }

  if (input.email && input.email !== session_user.email) {
    const user_exists = await getUserByEmail(input.email);

    if (user_exists && user_exists.id !== session_user.id) {
      return { error: "Email already exists" };
    }

    const verificationCode = await generateVerificationCode(input.email);
    await sendVerificationEmail(verificationCode.email, verificationCode.code, session_user.name!);

    return { success: "Verification email sent" };
  }

  if (input.password && input.new_password && user.password) {
    const passwordMatch = await bcryptjs.compare(input.password, user.password);

    if (!passwordMatch) {
      return { error: "Incorrect password" };
    }

    const hashedPassword = await bcryptjs.hash(input.new_password, 10);

    input.password = hashedPassword;
    input.new_password = undefined;
  }

  await db.user.update({
    where: { id: user.id },
    data: { ...input },
  });

  return { success: "Settings updated" };
};
