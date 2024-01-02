import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const validFields = RegisterSchema.safeParse(payload);

    if (!validFields.success) {
      return NextResponse.json({ error: "Invalid credentials" });
    }

    const { email, password, name } = validFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" });
    }

    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      await tx.aiData.create({
        data: {
          userId: user.id,
        },
      });

      await tx.userLimit.create({
        data: {
          userId: user.id,
        },
      });

      await tx.userUsage.create({
        data: {
          userId: user.id,
        },
      });
    });

    // TODO: Send Verification Email

    return NextResponse.json({ success: "User created" });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
