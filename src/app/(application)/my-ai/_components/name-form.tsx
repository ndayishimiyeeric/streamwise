"use client";

import React from "react";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/app/_trpc/client";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  aiData: AiData;
};

function NameForm({ aiData, subscriptionPlan }: Props) {
  const router = useRouter();
  const form = useForm<MyAiBioType>({
    resolver: zodResolver(MyAiDataSchema),
    defaultValues: {
      name: aiData.name || "",
      bio: aiData.bio || "",
      imgUrl: aiData.imgUrl || "",
    },
  });

  const { mutate: handleSubmit, isLoading } = trpc.updateAiData.useMutation({
    onSuccess: (data) => {
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error saving. Please try again");
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
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>{aiData.name}&apos;s Name</CardTitle>
            <CardDescription>Customize the name of your AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder={`${aiData.name}'s Name`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-700" />
                </FormItem>
              )}
              name="name"
              control={form.control}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default NameForm;
