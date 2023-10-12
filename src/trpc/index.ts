import { authProcedure, publicProcedure, router } from "./trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import {
  DeleteFileInput,
  GetFileInput,
  GetFileUploadStatusInput,
} from "@/lib/validators/file";
import { GetFileMessagesSchema } from "@/lib/validators/message";
import { QUERY_LIMIT } from "@/config/query";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.id || !user.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
        cause: "Unauthorized",
      });
    }

    // check if user is the database
    const dbUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // create user in database
      await db.user.create({
        data: {
          id: user.id,
          email: user.email!,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: authProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return db.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  deleteFile: authProcedure
    .input(DeleteFileInput)
    .mutation(async ({ ctx, input }) => {
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

      return file;
    }),
  getFile: authProcedure
    .input(GetFileInput)
    .mutation(async ({ ctx, input }) => {
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

  getFileMessages: authProcedure
    .input(GetFileMessagesSchema)
    .query(async ({ input, ctx }) => {
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
});

export type AppRouter = typeof appRouter;
