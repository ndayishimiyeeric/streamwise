import authConfig from "@/auth.config";
import { getUserById, getUserSettingsById } from "@/data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserLanguage, UserRole, UserSettings } from "@prisma/client";
import NextAuth from "next-auth";

import { db } from "@/lib/db";

import { getAccountByUserId } from "./data/account";
import { createOrRetrieveCustomer } from "./data/stripe";
import { getSubscription } from "./data/subscriptions";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { SubscriptionWithProduct } from "./types";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);
      if (!existingUser || !existingUser.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorComfirm = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorComfirm) return false;

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorComfirm.id,
          },
        });
      }

      return true;
    },

    async jwt({ token }) {
      if (!token.sub) return token;
      const user = await getUserById(token.sub);

      if (!user) return token;
      const userSettings = await getUserSettingsById(user.id);
      const userAccount = await getAccountByUserId(user.id);
      const subscription = await getSubscription(user.id);

      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.image = user.image;
      token.subscription = subscription;
      token.bio = user.bio;
      token.username = user.username;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;
      token.isPrivate = user.isPrivate;
      token.isOAuth = !!userAccount;
      token.imagekey = user.imagekey;
      token.settings = userSettings;
      token.updateEmail = user.updateEmail;
      token.updateUsername = user.updateUsername;
      token.language = user.language;
      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.language = token.language as UserLanguage;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.subscription && session.user) {
        session.user.subscription = token.subscription as SubscriptionWithProduct;
      }

      if (token.image && session.user) {
        session.user.image = token.image as string;
      }

      if (token.bio && session.user) {
        session.user.bio = token.bio as string;
      }

      if (token.username && session.user) {
        session.user.username = token.username as string;
      }

      if (token.imagekey && session.user) {
        session.user.imagekey = token.imagekey as string;
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (token.isPrivate && session.user) {
        session.user.isPrivate = token.isTwoFactorEnabled as boolean;
      }

      if (token.settings && session.user) {
        session.user.settings = token.settings as UserSettings;
      }

      if (token.updateUsername && session.user) {
        session.user.updateUsername = token.updateUsername as Date;
      }

      if (token.updateUsername && session.user) {
        session.user.updateEmail = token.updateEmail as Date;
      }

      return session;
    },
  },
  events: {
    async signIn({ isNewUser, user }) {
      if (isNewUser) {
        await db.$transaction(async (tx) => {
          await tx.aiData.upsert({
            where: {
              userId: user.id,
            },
            update: {},
            create: {
              userId: user.id,
            },
          });

          await tx.userLimit.upsert({
            where: {
              userId: user.id,
            },
            update: {},
            create: {
              userId: user.id,
            },
          });

          await tx.userUsage.upsert({
            where: {
              userId: user.id,
            },
            update: {},
            create: {
              userId: user.id,
            },
          });

          await tx.userSettings.upsert({
            where: {
              userId: user.id,
            },
            update: {},
            create: {
              userId: user.id,
            },
          });
        });
      }
    },

    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      await createOrRetrieveCustomer(user.email as string, user.id);
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
