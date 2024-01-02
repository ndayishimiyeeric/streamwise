import { connect } from "http2";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

import { db } from "@/lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserById(user.id);

      if (!existingUser || !existingUser.emailVerified) return false;
      return true;
    },

    async jwt({ token }) {
      if (!token.sub) return token;
      const user = await getUserById(token.sub);

      if (!user) return token;
      token.role = user.role;
      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.sub as UserRole;
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
        });
      }
    },

    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
