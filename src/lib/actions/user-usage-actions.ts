import { db } from "@/lib/db";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getSubscription } from "@/lib/actions/index";

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

  const userLimit = await db.userLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userLimit) return true;

  return userUsageExits.queryUsage < userLimit.queryLimit;
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

  const userLimit = await db.userLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userLimit) return true;

  return userUsageExits.pdfUploadUsage < userLimit.pdfUploadLimit;
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

export const getUserMaxFileLimit = async () => {
  const { getUser } = getKindeServerSession();
  const { id: userId } = getUser();

  if (!userId) {
    return {
      maxFileSize: 4,
      maxPagesPdf: 10,
    };
  }

  const userLimit = await db.userLimit.findUnique({
    where: {
      userId,
    },
    select: {
      maxFileSize: true,
      maxPagesPdf: true,
    },
  });

  return {
    maxFileSize: userLimit?.maxFileSize || 4,
    maxPagesPdf: userLimit?.maxPagesPdf || 5,
  };
};
