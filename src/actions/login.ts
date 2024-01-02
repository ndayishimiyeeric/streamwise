"use server";

import { signIn } from "@/auth";
import { getTwoFactorCodeByEmail } from "@/data/two-factor-code";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import * as z from "zod";

import { db } from "@/lib/db";
import { sendTwoFactorCodeEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorCode, generateVerificationCode } from "@/lib/tokens";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials" };
  }

  const isPasswordValid = await bcryptjs.compare(password, existingUser.password);

  if (!isPasswordValid) {
    return { error: "Invalid credentials" };
  }

  if (!existingUser.emailVerified) {
    const verificationCode = await generateVerificationCode(email);
    await sendVerificationEmail(verificationCode.email, verificationCode.code, existingUser.name!);

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const dbCode = await getTwoFactorCodeByEmail(existingUser.email);
      if (!dbCode || dbCode.code !== code) {
        return { error: "Invalid code" };
      }

      const isExpired = new Date(dbCode.expires) < new Date();

      if (isExpired) {
        return { error: "Code expired" };
      }

      await db.twoFactorCode.delete({
        where: { id: dbCode.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFA = await generateTwoFactorCode(existingUser.email);
      await sendTwoFactorCodeEmail(existingUser.email, twoFA.code);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
