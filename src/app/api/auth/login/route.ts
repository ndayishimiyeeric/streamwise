import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

export async function POST(req: NextRequest) {
  // not redirecting to the dashboard after login
  const payload = await req.json();
  const validFields = LoginSchema.safeParse(payload);

  if (!validFields.success) {
    return NextResponse.json({ error: "Invalid credentials" });
  }

  try {
    const { email, password } = validFields.data;
    await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json({ error: "Invalid credentials" });
        default:
          return NextResponse.json({ error: "Something went wrong" });
      }
    }
    throw error;
  }

  return new Response(null);
}
