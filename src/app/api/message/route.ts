import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { SendMessageSchema } from "@/lib/validators/message";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { getUser } = getKindeServerSession();
    const { id: userId } = getUser();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileId, message } = SendMessageSchema.parse(payload);

    const file = await db.file.findUnique({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.message.create({
      data: {
        fileId,
        text: message,
        isUserMessage: true,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
