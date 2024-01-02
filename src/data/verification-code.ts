import { db } from "@/lib/db";

export const getVerificationCodeByEmail = async (email: string) => {
  try {
    const code = await db.verificationCode.findFirst({
      where: {
        email,
      },
    });

    return code;
  } catch {
    return null;
  }
};

export const getVerificationCodeByCode = async (code: string) => {
  try {
    const _code = await db.verificationCode.findUnique({
      where: {
        code,
      },
    });

    return _code;
  } catch {
    return null;
  }
};
