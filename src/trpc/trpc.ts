import { initTRPC, TRPCError } from "@trpc/server";
import { auth, currentUser } from "@clerk/nextjs";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      cause: "Unauthorized",
    });
  }

  return opts.next({
    ctx: {
      userId,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthenticated);
