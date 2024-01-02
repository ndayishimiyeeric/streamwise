import { db } from "@/lib/db";

export const getPasswordResetCodeByEmail = async (email: string) => {
  try {
    const code = db.passwordResetCode.findFirst({
      where: {
        email,
      },
    });

    return code;
  } catch {
    return null;
  }
};

export const getPasswordResetCodeByCode = async (code: string) => {
  try {
    const _code = db.passwordResetCode.findUnique({
      where: {
        code,
      },
    });

    return _code;
  } catch {
    return null;
  }
};
