import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas";
import bcryp from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credential from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credential({
      async authorize(credentials) {
        const validCredentials = LoginSchema.safeParse(credentials);

        if (validCredentials.success) {
          const { email, password } = validCredentials.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await bcryp.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
