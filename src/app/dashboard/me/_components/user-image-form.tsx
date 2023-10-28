"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from ".prisma/client";

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
import { UserDataSchema, UserDataSchemaType } from "@/lib/validators/user";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  data: User;
};

function UserImageForm({ data, subscriptionPlan }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UserDataSchemaType>({
    defaultValues: {
      imgUrl: data.imgUrl || "",
      name: data.name || "",
    },
    resolver: zodResolver(UserDataSchema),
  });

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const { mutate: handleSubmit, isLoading } = trpc.updateUserData.useMutation({
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
        <CardTitle>Profile Image</CardTitle>
        <CardDescription>Customize your profile image.</CardDescription>
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

          {!isEditing && !data.imgUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Image
            </>
          )}

          {!isEditing && data.imgUrl && (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Update Image
            </>
          )}
        </Button>
        {!isEditing &&
          (!data.imgUrl ? (
            <div className="flex items-center justify-center h-60 rounded-lg bg-primary/30">
              <ImageIcon className="w-10 h-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative h-60 aspect-square mt-2">
              <Image
                src={data.imgUrl}
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
              endpoint="imageUploader"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UserImageForm;
