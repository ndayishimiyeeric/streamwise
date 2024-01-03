import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { File, Message } from "@prisma/client";
import { format } from "date-fns";
import { FileIcon, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";

type FileWithMessages = File & {
  messages: Message[];
};
interface Props {
  file: File;
  messages: Message[];
}

function DashboardFileCard({ file, messages }: Props) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { mutate: deleteFile, isLoading } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate().then((r) => r);
    },
  });

  const handleDelete = async (): Promise<void> => {
    deleteFile({ id: file.id });
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return router.refresh();
  };

  return (
    <li
      key={file.id}
      className="col-span-1 divide-y overflow-hidden rounded-lg border bg-background shadow transition hover:shadow-lg"
    >
      <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between space-x-1 px-6 pt-6">
          <FileIcon className="h-6 w-6" />
          <div className="flex-1 truncate">
            <div className="flex items-center">
              <h3 className="truncate text-base font-medium">{file.name}</h3>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex place-items-center gap-6 px-6 py-2 text-xs">
        <div className="hidden items-center gap-2 sm:flex">
          <Plus className="h-4 w-4" />
          {format(new Date(file.createdAt), "MMM yyyy")}
        </div>

        <div className="flex flex-1 items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {messages.length} messages
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
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
        </Button>
      </div>
    </li>
  );
}

export default DashboardFileCard;
