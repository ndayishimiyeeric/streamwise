import { auth } from "@/auth";
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const session = await auth();

  if (!session?.user.id || !session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      cause: "Unauthorized",
    });
  }

  return opts.next({
    ctx: {
      userId: session.user.id,
      user: session.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthenticated);
