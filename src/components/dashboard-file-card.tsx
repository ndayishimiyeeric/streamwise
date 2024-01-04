"use client";

import React from "react";
import Link from "next/link";
import { deleteFile } from "@/actions/file/delete";
import { File, Message } from "@prisma/client";
import { format } from "date-fns";
import { ExternalLink, FileIcon, Trash } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { useActionDialog } from "@/hooks/use-action-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ActionDialog } from "@/components/action-dialog";
import { Hint } from "@/components/hint";

interface Props {
  file: File;
  messages: Message[];
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const DashboardFileCard = ({
  file,
  messages,
  side = "bottom",
  align,
  sideOffset,
}: Props) => {
  const { onOPen, onClose, file: stateFile } = useActionDialog();

  const { execute, isLoading } = useAction(deleteFile, {
    onSuccess: (data) => {
      toast("Deleted file", {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
            <code className="text-primary-foreground">
              {JSON.stringify({ Name: data.name, Pages: data.pages, size: data.size }, null, 2)}
            </code>
          </pre>
        ),
      });
    },
    onError: (error) => {
      toast("File deletion error", {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
            <code className="text-primary-foreground">{JSON.stringify({ error }, null, 2)}</code>
          </pre>
        ),
      });
    },
    onCompleted: () => {
      onClose();
    },
  });

  return (
    <>
      {stateFile && (
        <ActionDialog
          actionHandler={() => execute({ id: stateFile.id })}
          description={`This file "${stateFile.name.replaceAll(
            ".pdf",
            ""
          )}" will be permenently deleted.`}
          title="Are you sure you want to delete this file?"
          isLoading={isLoading}
        />
      )}
      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            size="lg"
            className="parent-container group h-16 w-full justify-start gap-x-2 rounded-full px-4"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted shadow-sm transition-all ease-in-out group-hover:bg-primary/90 group-hover:shadow-md">
              <FileIcon className="icon h-1/2 w-1/2 text-primary/60 group-hover:text-background" />
            </div>
            <div className="truncate">
              <h3 className="text-sm">{file.name.replaceAll(".pdf", "")}</h3>
              <p className="flex justify-start text-muted-foreground">PDF</p>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={sideOffset} side={side} align={align} className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">File details</h4>
              <p className="text-sm text-muted-foreground">This is your file details</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Name</Label>
                <div className="col-span-2 truncate text-sm">
                  {file.name.replaceAll(".pdf", "")}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Pages</Label>
                <div className="col-span-2 truncate text-sm">{file.pages}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Messages</Label>
                <div className="col-span-2 truncate text-sm">{messages.length}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Size</Label>
                <div className="col-span-2 truncate text-sm">{file.size}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Format</Label>
                <div className="col-span-2 truncate text-sm">pdf</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Date</Label>
                <time className="col-span-2 truncate text-sm">
                  {format(new Date(file.updatedAt), "MMM, dd yyyy HH:mm")}
                </time>
              </div>
            </div>
            <Separator />
            <div className="space-x-3">
              <Hint side="top" description="Open file">
                <Link
                  href={`/dashboard/${file.id}`}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "icon",
                      className: "h-8 w-8 shadow-none",
                    })
                  )}
                  aria-disabled={isLoading}
                  aria-readonly={isLoading}
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Hint>
              <Hint description="Delete file" side="top">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 shadow-none"
                  disabled={isLoading}
                  onClick={() => onOPen({ id: file.id, name: file.name })}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </Hint>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
