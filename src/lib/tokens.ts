import { getPasswordResetCodeByEmail } from "@/data/password-reset-code";
import { getVerificationCodeByEmail } from "@/data/verification-code";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";

export const generateVerificationCode = async (email: string) => {
  const code = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingCode = await getVerificationCodeByEmail(email);

  if (existingCode) {
    await db.verificationCode.delete({
      where: {
        id: existingCode.id,
      },
    });
  }

  const verificationCode = await db.verificationCode.create({
    data: {
      code,
      email,
      expires,
    },
  });

  return verificationCode;
};

export const generatePasswordResetCode = async (email: string) => {
  const code = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingCode = await getPasswordResetCodeByEmail(email);

  if (existingCode) {
    await db.passwordResetCode.delete({
      where: {
        id: existingCode.id,
      },
    });
  }

  const passwordResetCode = await db.passwordResetCode.create({
    data: {
      code,
      email,
      expires,
    },
  });

  return passwordResetCode;
};
