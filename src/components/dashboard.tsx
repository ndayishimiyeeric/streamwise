"use client";

import React from "react";

import UploadButton from "@/components/upload-button";
import { Ghost } from "lucide-react";
import Skeleton from "react-loading-skeleton";

import { trpc } from "@/app/_trpc/client";
import DashboardFileCard from "@/components/dashboard-file-card";

interface Props {}
function Dashboard({}: Props) {
  const { data: userFiles, isLoading } = trpc.getUserFiles.useQuery();
  return (
    <main className="max-w-7xl mx-auto md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="text-4xl font-bold text-gray-900">My Files</h1>
        <UploadButton />
      </div>

      {userFiles && userFiles.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {userFiles
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
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
                />
              );
            })}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-lg">
            You don&apos;t have any files yet
          </h3>
          <p>Upload your first PDF</p>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
