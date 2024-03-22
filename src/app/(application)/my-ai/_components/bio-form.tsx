"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiData } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getSubscription } from "@/lib/actions";
import { MyAiBioType, MyAiDataSchema } from "@/lib/validators/my-ai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/app/_trpc/client";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  aiData: AiData;
};

function BioForm({ subscriptionPlan, aiData }: Props) {
  const router = useRouter();
  const [wordCount, setWordCount] = useState<number>(aiData.bio.length);

  const countChars = (textarea: HTMLTextAreaElement) => {
    return textarea.value.length;
  };

  const form = useForm<MyAiBioType>({
    resolver: zodResolver(MyAiDataSchema),
    defaultValues: {
      bio: aiData.bio || "",
      imgUrl: aiData.imgUrl || "",
      name: aiData.name || "",
    },
  });

  const { mutate: handleSubmit, isLoading } = trpc.updateAiData.useMutation({
    onSuccess: (data) => {
      router.refresh();
    },
    onError: (error) => {
      router.refresh();
    },
  });

  const handleUpdate = async (values: MyAiBioType): Promise<void> => {
    handleSubmit(values);
    return await new Promise((resolve) => setTimeout(resolve, 900));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          toast
            .promise(handleUpdate(data), {
              loading: "Updating...",
              success: "Name updated",
              error: "Error saving.",
            })
            .then((r) => r);
        })}
      >
        <Card className="rounded-2xl border-2 border-[#BF953F] shadow-[#BF953F]">
          <CardHeader>
            <CardTitle>{aiData.name}&apos;s Bio</CardTitle>
            <CardDescription>Influence how {aiData.name} will interact with you.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={subscriptionPlan.name !== "Gold"}
                      className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch aspect-square max-h-32 min-h-[8rem] focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder={`Customize the personality of ${aiData.name}, ex: you are a kind, smart, and creative friend.`}
                      onKeyUp={(e) => {
                        setWordCount(countChars(e.target as HTMLTextAreaElement));
                      }}
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">{wordCount} / 300</FormDescription>
                </FormItem>
              )}
              name="bio"
              control={form.control}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={subscriptionPlan.name !== "Gold"}
              className="gradient-gold font-semibold text-black"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default BioForm;
