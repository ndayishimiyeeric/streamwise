import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const validFields = LoginSchema.safeParse(payload);

    if (!validFields.success) {
      return NextResponse.json({ error: "Invalid credentials" });
    }

    const { email, password } = validFields.data;

    try {
      await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return NextResponse.json({ error: "Invalid credentials" });
          default:
            return NextResponse.json({ error: "Internal Server Error" });
        }
      }
    }
  } catch (error) {
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
