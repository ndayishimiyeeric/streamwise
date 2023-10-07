"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResizeDetector } from "react-resize-detector";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  url: string;
};

function PdfRenderer({ url }: Props) {
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const PageSchema = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type PageSchemaType = z.infer<typeof PageSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PageSchemaType>({
    resolver: zodResolver(PageSchema),
    defaultValues: {
      page: "1",
    },
  });

  const handlePageSubmit = (value: PageSchemaType) => {
    setCurrentPage(Number(value.page));
    setValue("page", String(value.page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            aria-label="previous page"
            variant="ghost"
            size="icon"
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 < 1 ? 1 : prev - 1));
              setValue("page", String(currentPage - 1));
            }}
            disabled={currentPage <= 1}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "?"}</span>
            </p>
          </div>
          <Button
            aria-label="next page"
            variant="ghost"
            size="icon"
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > (numPages ?? 1) ? numPages ?? 1 : prev + 1,
              );
              setValue("page", String(currentPage + 1));
            }}
            disabled={currentPage >= (numPages ?? 1)}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
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
            <Page width={width ? width : 1} pageNumber={currentPage}></Page>
          </Document>
        </div>
      </div>
    </div>
  );
}

export default PdfRenderer;
