"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiData } from "@prisma/client";
import { ImageIcon, Pencil, PlusCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

import { MyAiBioType } from "@/lib/validators/my-ai";
import { getSubscription } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/image-uploader";
import { trpc } from "@/app/_trpc/client";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  aiData: AiData;
};

function ImageForm({ aiData, subscriptionPlan }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<MyAiBioType>({
    defaultValues: {
      name: aiData.name || "",
      bio: aiData.bio || "",
      imgUrl: aiData.imgUrl || "",
    },
  });

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const { mutate: handleSubmit, isLoading } = trpc.updateAiData.useMutation({
    onSuccess: (data) => {
      router.refresh();
      toggleEditing();
    },
  });

  const handleUpdate = async (url: string): Promise<void> => {
    handleSubmit({ ...form.getValues(), imgUrl: url });
    return await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <Card className="rounded-2xl bg-white">
      <CardHeader>
        <CardTitle>{aiData.name}&apos;s Image</CardTitle>
        <CardDescription>
          Customize the image of your AI assistant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="mb-2"
          type="button"
          variant="outline"
          onClick={toggleEditing}
        >
          {isEditing && (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </>
          )}

          {!isEditing && !aiData.imgUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Image
            </>
          )}

          {!isEditing && aiData.imgUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Update Image
            </>
          )}
        </Button>
        {!isEditing &&
          (!aiData.imgUrl ? (
            <div className="flex items-center justify-center h-60 rounded-lg bg-primary/30">
              <ImageIcon className="w-10 h-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative h-60 aspect-square mt-2">
              <Image
                src={aiData.imgUrl}
                alt="ai image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ))}
        {isEditing && (
          <div>
            <ImageUploader
              onUpload={(url) => {
                if (url) {
                  toast
                    .promise(handleUpdate(url), {
                      loading: "Updating image...",
                      success: "Image updated",
                      error: "Error updating image",
                    })
                    .then((r) => r);
                }
              }}
              endpoint="aiDataImageUploader"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImageForm;
