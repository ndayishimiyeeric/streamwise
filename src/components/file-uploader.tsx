"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/actions/file/upload";
import { Cloud } from "lucide-react";
import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";
import { useAction } from "@/hooks/use-action";
import { useUploadButton } from "@/hooks/use-upload-button";
import { Card, CardContent } from "@/components/ui/card";

interface FileUploaderProps {
  fileLimit?: number;
}

function FileUploader({ fileLimit = 4 }: FileUploaderProps) {
  const router = useRouter();
  const { onClose } = useUploadButton();

  const { execute } = useAction(uploadFile, {
    onSuccess: (data) => {
      toast("File upload status", {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
            <code className="text-primary-foreground">
              {JSON.stringify(
                { Name: data.name, Pages: data.pages, Status: data.uploadStatus },
                null,
                2
              )}
            </code>
          </pre>
        ),
      });

      router.refresh();
      router.push("/dashboard");
    },
    onError(error) {
      toast("Settings update status", {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
            <code className="text-primary-foreground">{JSON.stringify({ error }, null, 2)}</code>
          </pre>
        ),
      });
    },
  });

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <UploadDropzone
          endpoint="pdfUploader"
          onClientUploadComplete={(res) => {
            if (!res) {
              onClose();
              return router.push("/dashboard/usage");
            }
            onClose();
            const [fileResponse] = res;
            const key = fileResponse.key;
            const url = fileResponse.url;
            const name = fileResponse.name;
            const size = fileResponse.size;

            toast.promise(execute({ url, key, name, size }), {
              loading: "Prossing file...",
              success: "File processed successfully",
              error: "Error while processing file",
            });
          }}
          content={{
            uploadIcon: <Cloud className="h-6 w-6 text-primary" />,
            label: (
              <p className="mb-2 text-center text-sm text-primary">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
            ),
            allowedContent: <p className="text-xs text-primary/80">PDF (up to {fileLimit}MB)</p>,
          }}
        />
      </CardContent>
    </Card>
  );
}

export default FileUploader;
