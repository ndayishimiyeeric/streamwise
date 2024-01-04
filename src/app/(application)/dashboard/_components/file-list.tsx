import { redirect } from "next/navigation";
import { getUserFilesAndMessageById } from "@/data/files";
import { Ghost } from "lucide-react";

import { currentUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardFileCard } from "@/components/dashboard-file-card";

export const FileList = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }
  const data = await getUserFilesAndMessageById(user.id);
  return (
    <>
      {data && data.length !== 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((file) => {
              const formattedFile = {
                ...file,
                createdAt: new Date(file.createdAt),
                updatedAt: new Date(file.updatedAt),
                messages: file.messages.map((message) => ({
                  ...message,
                  createdAt: new Date(message.createdAt) as Date,
                  updatedAt: new Date(message.updatedAt) as Date,
                })),
              };
              return (
                <DashboardFileCard
                  file={formattedFile}
                  messages={formattedFile.messages}
                  key={file.id}
                  side="top"
                />
              );
            })}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8" />
          <h3 className="text-lg font-semibold">You don&apos;t have any files yet</h3>
          <p>Upload your first PDF</p>
        </div>
      )}
    </>
  );
};

FileList.Skeleton = function FileListSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          className="inline-flex h-16 w-[200px] items-center justify-start gap-x-2 rounded-full border px-4"
          key={index}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted shadow-sm">
            <Skeleton className="icon h-1/2 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24"></Skeleton>
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
};
