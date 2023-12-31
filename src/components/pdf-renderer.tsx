"use client";

import React from "react";
import { pdfjs } from "react-pdf";

import PdfRendererFullscreen from "@/components/pdf-renderer-fullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  url: string;
};

function PdfRenderer({ url }: Props) {
  return (
    <div className="flex w-full flex-col items-center rounded-md shadow">
      <div className="flex w-full items-center justify-between border border-b">
        <PdfRendererFullscreen url={url} />
      </div>
    </div>
  );
}

export default PdfRenderer;
