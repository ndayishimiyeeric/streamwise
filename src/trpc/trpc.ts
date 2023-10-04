import { initTRPC, TRPCError } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id || !user.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      cause: "Unauthorized",
    });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthenticated);
