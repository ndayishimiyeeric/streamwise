"use server";

import { getUserByEmail } from "@/data/user";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetCode } from "@/lib/tokens";

export const Reset = async (input: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(input);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;
  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "User not found" };
  }

  const passwordResetCode = await generatePasswordResetCode(email);
  await sendPasswordResetEmail(
    passwordResetCode.email,
    passwordResetCode.code,
    user.name || passwordResetCode.email
  );

  return { success: "Reset email sent" };
};
