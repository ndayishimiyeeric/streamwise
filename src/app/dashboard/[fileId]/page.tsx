import React from "react";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import PdfRenderer from "@/components/pdf-renderer";
import ChatWrapper from "@/components/chat-wrapper";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
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
    <div className="flex flex-1 flex-col justify-between h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/*PDF Side*/}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>

        {/*Chat Side*/}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
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
