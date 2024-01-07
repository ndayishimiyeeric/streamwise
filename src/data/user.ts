import { PLANS } from "@/config/plans/plan";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const DAY_IN_MS = 86_400_000;

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findFirst({
      where: { email },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findFirst({
      where: { id },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserSettingsById = async (userId: string) => {
  try {
    const userSettings = await db.userSettings.findFirst({
      where: { userId },
    });

    return userSettings;
  } catch {
    return null;
  }
};

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

export const clientPromptLimit = async (userId: string) => await getPromptUsage(userId);

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

export const getUserMaxFileLimit = async (userId: string) => {
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

export const getPurchases = async (userId: string) => {
  const purchases = await db.userPurchase.findMany({
    where: {
      userId,
    },
  });

  if (!purchases) {
    return [];
  }

  return purchases.map((purchase) => ({
    date: purchase.createdAt,
    amount: purchase.amount,
    status: purchase.success ? "Success" : "Failed",
  }));
};

export interface GraphData {
  name: string;
  value: number;
}

export const getGraphData = async (userId: string) => {
  const userMessages = await db.message.findMany({
    where: {
      userId,
      isUserMessage: true,
    },
  });

  const userUploads = await db.file.findMany({
    where: {
      userId,
    },
  });

  const monthlyUsage: { [key: string]: number } = {};

  for (const message of userMessages) {
    const month = message.createdAt.getMonth();

    if (monthlyUsage[month]) {
      monthlyUsage[month] += 1;
    } else {
      monthlyUsage[month] = 1;
    }
  }

  for (const file of userUploads) {
    const month = file.createdAt.getMonth();

    if (monthlyUsage[month]) {
      monthlyUsage[month] += 1;
    } else {
      monthlyUsage[month] = 1;
    }
  }

  const graphData: GraphData[] = [
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "May", value: 0 },
    { name: "Jun", value: 0 },
    { name: "Jul", value: 0 },
    { name: "Aug", value: 0 },
    { name: "Sep", value: 0 },
    { name: "Oct", value: 0 },
    { name: "Nov", value: 0 },
    { name: "Dec", value: 0 },
  ];

  for (const month in monthlyUsage) {
    graphData[parseInt(month)].value = monthlyUsage[month];
  }

  return graphData;
};
