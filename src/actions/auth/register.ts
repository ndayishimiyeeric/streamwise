"use server";

import { getUserByEmail } from "@/data/user";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationCode } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Invalid credentials!" };
  }

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    await tx.aiData.create({
      data: {
        userId: user.id,
      },
    });

    await tx.userLimit.create({
      data: {
        userId: user.id,
      },
    });

    await tx.userUsage.create({
      data: {
        userId: user.id,
      },
    });

    await tx.userSettings.create({
      data: {
        userId: user.id,
      },
    });
  });

  const verificationToken = await generateVerificationCode(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.code, name);

  return { success: "Confirmation email sent!" };
};
