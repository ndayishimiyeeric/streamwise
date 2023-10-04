"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function UploadButton() {
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

      <DialogContent>test</DialogContent>
    </Dialog>
  );
}

export default UploadButton;
