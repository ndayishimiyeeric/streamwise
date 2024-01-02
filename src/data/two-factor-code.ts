import { db } from "@/lib/db";

export const getTwoFactorCodeByEmail = async (email: string) => {
  try {
    const code = db.twoFactorCode.findFirst({
      where: {
        email,
      },
    });

    return code;
  } catch {
    return null;
  }
};

export const getTwoFactorCodeByCode = async (code: string) => {
  try {
    const _code = db.twoFactorCode.findUnique({
      where: {
        code,
      },
    });

    return _code;
  } catch {
    return null;
  }
};
