"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiData } from "@prisma/client";
import { ImageIcon, Pencil, PlusCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getSubscription } from "@/lib/actions";
import { MyAiBioType } from "@/lib/validators/my-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{aiData.name}&apos;s Image</CardTitle>
        <CardDescription>Customize the image of your AI assistant.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="mb-2" type="button" variant="outline" onClick={toggleEditing}>
          {isEditing && (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </>
          )}

          {!isEditing && !aiData.imgUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Image
            </>
          )}

          {!isEditing && aiData.imgUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Update Image
            </>
          )}
        </Button>
        {!isEditing &&
          (!aiData.imgUrl ? (
            <div className="flex h-60 items-center justify-center rounded-lg bg-primary/30">
              <ImageIcon className="h-10 w-10" />
            </div>
          ) : (
            <div className="relative mt-2 aspect-square h-60">
              <Image
                src={aiData.imgUrl}
                alt="ai image"
                fill
                className="rounded-lg object-contain"
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
              endpoint="imageUploader"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImageForm;
