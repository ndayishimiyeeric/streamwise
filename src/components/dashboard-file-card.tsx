import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { File } from "@prisma/client";

import { trpc } from "@/app/_trpc/client";
import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Props {
  file: File;
}

function DashboardFileCard({ file }: Props) {
  const utils = trpc.useContext();
  const { mutate: deleteFile, isLoading } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate().then((r) => r);
    },
  });

  const handleDelete = async (): Promise<void> => {
    deleteFile({ id: file.id });
    return await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <li
      key={file.id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
    >
      <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg font-medium text-zinc-900">
                {file.name}
              </h3>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(file.createdAt), "MMM yyyy")}
        </div>

        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />3 messages
        </div>

        <Button
          onClick={() => {
            toast
              .promise(handleDelete(), {
                loading: "Deleting file...",
                success: "File deleted",
                error: "Error deleting file",
              })
              .then((r) => r);
          }}
          variant="destructive"
          size="sm"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
        </Button>
      </div>
    </li>
  );
}

export default DashboardFileCard;
