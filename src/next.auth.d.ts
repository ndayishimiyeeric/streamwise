import { UserLanguage, UserRole, UserSettings } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isPrivate: boolean;
  isOAuth: boolean;
  language: UserLanguage;
  updateEmail: Date | undefined;
  updateUsername: Date | undefined;
  settings: UserSettings;
  bio: string;
  username: string;
  imagekey: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
