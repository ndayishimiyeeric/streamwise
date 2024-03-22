"use server";

import { getPasswordResetCodeByCode } from "@/data/password-reset-code";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import bycrptjs from "bcryptjs";
import * as z from "zod";

import { db } from "@/lib/db";

export const newPassword = async (input: z.infer<typeof NewPasswordSchema>, code?: string) => {
  if (!code) return { error: "Invalid code" };

  const validateFields = NewPasswordSchema.safeParse(input);

  if (!validateFields.success) return { error: "Invalid password" };

  const _code = await getPasswordResetCodeByCode(code);

  if (!_code) return { error: "Invalid code" };

  const isExpired = new Date(_code.expires) < new Date();

  if (isExpired) return { error: "Code is expired" };

  const user = await getUserByEmail(_code.email);

  if (!user) return { error: "Email does not exist" };

  const hashedPassword = await bycrptjs.hash(input.password, 10);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetCode.delete({
    where: { id: _code.id },
  });

  return { success: "Password updated" };
};
