"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { OurFileRouter } from "@/app/api/uploadthing/core";

interface ImageUploaderProps {
  onUpload: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}

const ImageUploader = ({ onUpload, endpoint }: ImageUploaderProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onUpload(res?.[0].url);
      }}
      onUploadError={(err: Error) => {
        toast.error(`${err.message}`);
      }}
    />
  );
};

export default ImageUploader;
