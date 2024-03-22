"use client";

import React, { ElementRef, MutableRefObject, Ref, useEffect, useState } from "react";

import { useUploadButton } from "@/hooks/use-upload-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FileUploader from "@/components/file-uploader";

interface Props {
  uploadLimit?: number;
}

function UploadButton({ uploadLimit }: Props) {
  const { isOPen, onOPen, onClose } = useUploadButton();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <>
      <Button onClick={onOPen}>Upload PDF</Button>
      <Dialog open={isOPen} onOpenChange={onClose}>
        <DialogContent className="p-8">
          <FileUploader fileLimit={uploadLimit} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadButton;
