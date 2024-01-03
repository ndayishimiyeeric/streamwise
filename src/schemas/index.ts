import { UserFont, UserLanguage, UserTheme } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string(),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const AppearanceSchema = z.object({
  theme: z.optional(z.enum([UserTheme.DARK, UserTheme.LIGHT])),
  font: z.optional(
    z.enum([
      UserFont.BE_VIETNAM,
      UserFont.INTER,
      UserFont.POPPINS,
      UserFont.ROBOTO,
      UserFont.MONTSERRAT,
      UserFont.UBUNTU,
    ])
  ),
});

export const AccountSchema = z
  .object({
    name: z.optional(z.string()),
    username: z.optional(z.string()),
    bio: z.optional(z.string()),
    language: z.optional(
      z.enum([
        UserLanguage.ENGLISH,
        UserLanguage.FRENCH,
        UserLanguage.GERMAN,
        UserLanguage.PORTUGUESE,
        UserLanguage.SPANISH,
        UserLanguage.RUSSIAN,
        UserLanguage.CHINESE,
        UserLanguage.JAPANESE,
        UserLanguage.KOREAN,
      ])
    ),
    email: z.optional(z.string().email({ message: "Please enter a valid email address" })),
    isTwoFactorEnabled: z.optional(z.boolean()),
    isPrivate: z.optional(z.boolean()),
    password: z.optional(z.string()),
    new_password: z.optional(
      z.string().min(8, { message: "Password must be at least 8 characters long" })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.new_password) return false;
      return true;
    },
    { message: "New password is required", path: ["new_password"] }
  )
  .refine(
    (data) => {
      if (!data.password && data.new_password) return false;
      return true;
    },
    { message: "Current password is required", path: ["password"] }
  );
