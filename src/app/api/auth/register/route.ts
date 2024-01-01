import { NextRequest, NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const validFields = RegisterSchema.safeParse(payload);

    if (!validFields.success) {
      return NextResponse.json({ error: "Invalid credentials" });
    }

    return NextResponse.json({ success: "Email Sent" });
  } catch (error) {
    return new NextResponse("Internal Server error", { status: 500 });
  }
}