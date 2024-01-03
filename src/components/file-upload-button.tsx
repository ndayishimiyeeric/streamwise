"use client";

import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadButtonProps {
  endpoint: keyof typeof ourFileRouter;
  size?: "default" | "icon" | "sm" | "lg";
  onChange: ({ image, imagekey }: { image: string; imagekey: string }) => void;
}

export const FileUploadButton = ({ endpoint, size, onChange }: FileUploadButtonProps) => {
  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res) {
          onChange({ image: res?.[0].url, imagekey: res?.[0].key });
        }
      }}
      appearance={{
        button: cn(
          buttonVariants({
            variant: "default",
            size: "sm",
            className:
              "bg-transparent hover:bg-transparent max-w-[120px] focus-visible:ring-0 focus-within:ring-0 focus-visible:ring-offset-0 focus-within:ring-offset-0",
          })
        ),
        allowedContent: "hidden",
        container: cn(
          "focus-visible:ring-0 focus-within:ring-0 max-w-[120px] text-xs text-center ring-offset-0",
          buttonVariants({ variant: "default", size: size })
        ),
      }}
    />
  );
};
