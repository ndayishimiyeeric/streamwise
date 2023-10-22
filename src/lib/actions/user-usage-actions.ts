import { db } from "@/lib/db";

export const increasePromptUsage = async (userId: string) => {
  const userUsageExits = await db.userUsage.findUnique({
    where: {
      userId,
    },
  });

  if (userUsageExits) {
    await db.userUsage.update({
      where: {
        userId,
      },
      data: {
        queryUsage: userUsageExits.queryUsage + 1,
      },
    });
  } else {
    await db.userUsage.create({
      data: {
        userId,
        queryUsage: 1,
      },
    });
  }
};

export const checkPromptUsage = async (userId: string) => {
  const userUsageExits = await db.userUsage.findUnique({
    where: {
      userId,
    },
  });

  if (!userUsageExits) return true;

  return userUsageExits.queryUsage < 100;
};

export const getPromptUsage = async (userId: string) => {
  const userUsageExits = await db.userUsage.findUnique({
    where: {
      userId,
    },
  });

  if (!userUsageExits) return 0;

  return userUsageExits.queryUsage;
};

export const clientPromptLimit = async (userId: string) =>
  await getPromptUsage(userId);

export const increasePdfUploadUsage = async (userId: string) => {
  const userUsageExits = await db.userUsage.findUnique({
    where: {
      userId,
    },
  });

  if (userUsageExits) {
    await db.userUsage.update({
      where: {
        userId,
      },
      data: {
        pdfUploadUsage: userUsageExits.pdfUploadUsage + 1,
      },
    });
  } else {
    await db.userUsage.create({
      data: {
        userId,
        pdfUploadUsage: 1,
      },
    });
  }
};

export const checkPdfUploadUsage = async (userId: string) => {
  const userUsageExits = await db.userUsage.findUnique({
    where: {
      userId,
    },
  });

  if (!userUsageExits) return true;

  return userUsageExits.pdfUploadUsage < 100;
};

export const getPdfUploadUsage = async (userId: string) => {
  const userUsageExits = await db.userUsage.findUnique({
    where: {
      userId,
    },
  });

  if (!userUsageExits) return 0;

  return userUsageExits.pdfUploadUsage;
};
