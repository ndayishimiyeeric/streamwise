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
import { QUERY_LIMIT } from "@/config/user-usage";
import { absoluteUrl } from "@/lib/utils";
import { getSubscription } from "@/lib/actions";
import stripe from "@/lib/stripe";
import { CheckoutSchema } from "@/lib/validators/checkout";
import { PLANS } from "@/config/plans/plan";
import { MyAiDataSchema } from "@/lib/validators/my-ai";
import { qdrantClient } from "@/lib/qdrant";
import { UserDataSchema } from "@/lib/validators/user";
import { utapi } from "@/server/uploadthing";

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

    // check if user have Ai data
    const ai = await db.aiData.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!ai) {
      // create ai data
      await db.aiData.create({
        data: {
          userId: user.id,
        },
      });
    }

    // check if user have limit and usage
    const userLimit = await db.userLimit.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userLimit) {
      // create user limit
      await db.userLimit.create({
        data: {
          userId: user.id,
        },
      });
    }

    const userUsage = await db.userUsage.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userUsage) {
      // create user usage
      await db.userUsage.create({
        data: {
          userId: user.id,
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
      include: {
        messages: true,
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

      // decrease upload file usage
      await db.userUsage.update({
        where: {
          userId,
        },
        data: {
          pdfUploadUsage: {
            decrement: 1,
          },
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

  updateAiData: authProcedure
    .input(MyAiDataSchema)
    .mutation(async ({ ctx, input }) => {
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

      const subscription = await getSubscription();

      if (subscription.isSubscribed && subscription.name === "Gold") {
        await db.aiData.update({
          where: {
            userId,
          },
          data: {
            name,
            bio,
            imgUrl,
          },
        });
      } else {
        await db.aiData.update({
          where: {
            userId,
          },
          data: {
            name,
            imgUrl,
          },
        });
      }

      return aiData;
    }),

  updateUserData: authProcedure
    .input(UserDataSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { imgUrl } = input;

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
          imgUrl,
        },
      });

      return user;
    }),

  createStripeSession: authProcedure
    .input(CheckoutSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;
      const { email } = user;

      const billingUrl = absoluteUrl("dashboard/billing");

      if (!userId || !user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      const subscription = await db.subscription.findUnique({
        where: {
          userId,
        },
      });

      const subscriptionPlan = await getSubscription();

      if (
        subscriptionPlan.isSubscribed &&
        subscription?.stripeCustomerId &&
        subscriptionPlan.slug?.toLowerCase() === input.plan.toLowerCase()
      ) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: subscription.stripeCustomerId,
          return_url: billingUrl,
        });

        return { url: stripeSession.url };
      }

      const stipeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card", "paypal"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: email!,
        line_items: [
          {
            price: PLANS.find((p) => p.name === input.plan)?.price.priceIds
              .test,
            quantity: 1,
          },
        ],
        metadata: {
          userId: userId,
        },
      });

      return { url: stipeSession.url };
    }),
});

export type AppRouter = typeof appRouter;
