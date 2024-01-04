import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import UploadButton from "@/components/upload-button";

import { FileList } from "./_components/file-list";

async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userLimit = await db.userLimit.findFirst({
    where: {
      userId: user.id,
    },
  });

  return (
    <>
      <main className="mx-auto max-w-7xl p-10">
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="text-3xl font-bold">Files</h1>
          <UploadButton uploadLimit={userLimit?.pdfUploadLimit} />
        </div>
        <Suspense fallback={<FileList.Skeleton />}>
          <FileList />
        </Suspense>
      </main>
    </>
  );
}

export default DashboardPage;
