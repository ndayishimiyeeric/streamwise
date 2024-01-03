"use server";

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

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      email: _code.email,
      updateEmail: willUpdateEmail,
    },
  });

  await db.verificationCode.delete({
    where: { id: _code.id },
  });

  return { success: "Email verified" };
};
