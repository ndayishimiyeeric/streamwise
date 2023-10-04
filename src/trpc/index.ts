import { publicProcedure, router } from "./trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.id || !user.email) {
      throw new TRPCError({
        code: "FORBIDDEN",
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
});

export type AppRouter = typeof appRouter;
