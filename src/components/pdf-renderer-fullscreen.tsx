"use client";

import React, { useEffect, useState } from "react";
import { ExpandIcon, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import toast from "react-hot-toast";
import { useResizeDetector } from "react-resize-detector";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  url: string;
}

function PdfRendererFullscreen({ url }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const { width, ref } = useResizeDetector();

  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <Dialog
      open={fullScreen}
      onOpenChange={(view) => {
        if (!view) setFullScreen(view);
      }}
    >
      <DialogTrigger onClick={() => setFullScreen(true)}>
        <Button aria-label="fullscreen" variant="ghost" className="gap-1.5">
          <ExpandIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              className="max-h-full"
              file={url}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast.error("Failed to load PDF");
              }}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
            >
              {new Array(numPages).fill(0).map((_, index) => (
                <Page
                  key={index}
                  width={width ? width : 1}
                  pageNumber={index + 1}
                ></Page>
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}

export default PdfRendererFullscreen;
