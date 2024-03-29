import { utapi } from "@/server/uploadthing";
import { TRPCError } from "@trpc/server";

import { QUERY_LIMIT } from "@/config/user-usage";
import { db } from "@/lib/db";
import { qdrantClient } from "@/lib/qdrant";
import { absoluteUrl } from "@/lib/utils";
import { CheckoutSchema } from "@/lib/validators/checkout";
import { DeleteFileInput, GetFileInput, GetFileUploadStatusInput } from "@/lib/validators/file";
import { GetFileMessagesSchema } from "@/lib/validators/message";
import { MyAiDataSchema } from "@/lib/validators/my-ai";
import { UserDataSchema } from "@/lib/validators/user";

import { authProcedure, publicProcedure, router } from "./trpc";

export const appRouter = router({
  getUserFiles: authProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return db.file.findMany({
      where: {
        userId,
      },
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  deleteFile: authProcedure.input(DeleteFileInput).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await db.file.findUnique({
      where: {
        id: input.id,
        userId,
      },
    });

    if (!file)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File not found",
        cause: "File not found",
      });

    await db.file.delete({
      where: {
        id: input.id,
        userId,
      },
    });

    // delete file collection from qdrant
    await qdrantClient.deleteCollection(file.id);

    // delete file from UT
    await utapi.deleteFiles(file.key);

    // delete file messages
    await db.message.deleteMany({
      where: {
        fileId: file.id,
      },
    });

    return file;
  }),

  getFile: authProcedure.input(GetFileInput).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId,
      },
    });

    if (!file)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File not found",
      });

    return file;
  }),

  getFileUploadStatus: authProcedure
    .input(GetFileUploadStatusInput)
    .query(async ({ ctx, input }) => {
      const file = await db.file.findUnique({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFileMessages: authProcedure.input(GetFileMessagesSchema).query(async ({ input, ctx }) => {
    const { userId } = ctx;
    const { cursor, fileId } = input;
    const limit = input.limit ?? QUERY_LIMIT;

    const file = await db.file.findUnique({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File not found",
      });
    const messages = await db.message.findMany({
      where: {
        fileId,
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        isUserMessage: true,
        createdAt: true,
        text: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;

    if (messages.length > limit) {
      const nextMessage = messages.pop();
      nextCursor = nextMessage?.id;
    }

    return {
      messages,
      nextCursor,
    };
  }),

  updateAiData: authProcedure.input(MyAiDataSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { name, bio, imgUrl } = input;

    const aiData = await db.aiData.findUnique({
      where: {
        userId,
      },
    });

    if (!aiData)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Ai data not found",
      });

    return aiData;
  }),

  updateUserData: authProcedure.input(UserDataSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { imgUrl, name } = input;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        image: imgUrl,
        name,
      },
    });

    return user;
  }),

  createStripeSession: authProcedure.input(CheckoutSchema).mutation(async ({ ctx, input }) => {
    const { userId, user } = ctx;

    const billingUrl = absoluteUrl("dashboard/billing");

    return { ok: true };
  }),
});

export type AppRouter = typeof appRouter;
