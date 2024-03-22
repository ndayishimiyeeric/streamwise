import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const confirmation = db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return confirmation;
  } catch {
    return null;
  }
};
