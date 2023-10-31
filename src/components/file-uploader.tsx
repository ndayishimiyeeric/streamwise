"use client";

import React, { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cloud, File, Loader2 } from "lucide-react";

interface FileUploaderProps {
  fileLimit?: number;
}

function FileUploader({ fileLimit = 4 }: FileUploaderProps) {
  const router = useRouter();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/${data.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const handlePolling = async (key: string): Promise<void> => {
    startPolling({ key });
    return await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <UploadDropzone
          endpoint="pdfUploader"
          onUploadError={(err: Error) => {
            toast.error(`${err.message}`);
          }}
          onClientUploadComplete={(res) => {
            if (!res) {
              toast.error("Max upload limit reached.");
              return router.push("/dashboard/usage");
            }

            const [fileResponse] = res;
            const key = fileResponse.key;

            if (key) {
              toast
                .promise(handlePolling(key), {
                  loading: "Processing file",
                  success: "File processed",
                  error: "Error processing file",
                })
                .then((r) => r);
            } else {
              return toast.error(
                "Something went wrong. Please try again later.",
              );
            }
          }}
          content={{
            uploadIcon: <Cloud className="h-6 w-6 text-zinc-500" />,
            label: (
              <p className="text-sm text-zinc-700 mb-2 text-center">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            ),
            allowedContent: (
              <p className="text-xs text-zinc-500">PDF (up to {fileLimit}MB)</p>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
}

export default FileUploader;
