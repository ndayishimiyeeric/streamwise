import { authProcedure, publicProcedure, router } from "./trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { DeleteFileInput } from "@/lib/validators/file";

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
});

export type AppRouter = typeof appRouter;
