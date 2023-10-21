import { db } from "@/lib/db";

const increasePromptLimit = async (userId: string) => {
  const userLimitExists = await db.userLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userLimitExists) {
    await db.userLimit.update({
      where: {
        userId,
      },
      data: {
        limit: userLimitExists.limit + 1,
      },
    });
  } else {
    await db.userLimit.create({
      data: {
        userId,
        limit: 1,
      },
    });
  }
};

export const checkPromptLimit = async (userId: string) => {
  const userLimit = await db.userLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userLimit) return true;

  return userLimit.limit < 100;
};

export const getPromptLimit = async (userId: string) => {
  const userLimit = await db.userLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userLimit) return 0;

  return userLimit.limit;
};

export const clientPromptLimit = async (userId: string) =>
  await getPromptLimit(userId);
