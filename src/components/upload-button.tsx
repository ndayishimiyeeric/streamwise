"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/file-uploader";

interface Props {
  uploadLimit?: number;
}

function UploadButton({ uploadLimit }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <Dialog
      open={isOpened}
      onOpenChange={(prev) => {
        if (!prev) setIsOpened(prev);
      }}
    >
      <DialogTrigger onClick={() => setIsOpened(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent className="p-8">
        <FileUploader fileLimit={uploadLimit} />
      </DialogContent>
    </Dialog>
  );
}

export default UploadButton;
