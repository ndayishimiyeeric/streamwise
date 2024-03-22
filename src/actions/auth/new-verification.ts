"use server";

import { createOrRetrieveCustomer } from "@/data/stripe";
import { getUserByEmail } from "@/data/user";
import { getVerificationCodeByCode } from "@/data/verification-code";

import { db } from "@/lib/db";

export const newVerification = async (code: string) => {
  const _code = await getVerificationCodeByCode(code);

  if (!_code) return { error: "Invalid verification code" };

  const isExpired = new Date(_code.expires) < new Date();

  if (isExpired) return { error: "Verification code expired" };

  const user = await getUserByEmail(_code.email);

  if (!user) return { error: "Invalid email address" };

  const willUpdateEmail = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000); // 30 days

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        email: _code.email,
        updateEmail: willUpdateEmail,
      },
    });

    await tx.verificationCode.delete({
      where: { id: _code.id },
    });

    await createOrRetrieveCustomer(user.email as string, user.id);
  });

  return { success: "Email verified" };
};
