import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import ChatWrapper from "@/components/chat-wrapper";
import PdfRenderer from "@/components/pdf-renderer";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "@/styles/mdx.css";

import { getSubscription } from "@/lib/actions";

type Props = {
  params: {
    fileId: string;
  };
};

async function Page({ params }: Props) {
  const { fileId } = params;
  const { userId } = auth();

  if (!userId) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard/my-ai");
  }

  const aiData = await db.aiData.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!aiData) {
    redirect("/auth-callback?origin=dashboard/my-ai");
  }

  const subscription = await getSubscription();

  if (!file) notFound();

  return (
    <div className="flex h-[85vh] w-full flex-col justify-between">
      <div className="flex w-full grow px-2">
        <div className="relative flex-1">
          {/* <div className="fixed top-20 z-50 bg-background ">
            <PdfRenderer url={file.url} />
          </div> */}

          <ChatWrapper
            userName={dbUser.email}
            imageUrl={dbUser.imgUrl}
            fileId={fileId}
            aiData={aiData}
            subscriptionPlan={subscription}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
