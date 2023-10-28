"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { getSubscription } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { UserDataSchema, UserDataSchemaType } from "@/lib/validators/user";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  data: User;
};

function NameForm({ data, subscriptionPlan }: Props) {
  const router = useRouter();
  const form = useForm<UserDataSchemaType>({
    resolver: zodResolver(UserDataSchema),
    defaultValues: {
      name: data.name || "",
      imgUrl: data.imgUrl || "",
    },
  });

  const { mutate: handleSubmit, isLoading } = trpc.updateUserData.useMutation({
    onSuccess: (data) => {
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error saving. Please try again");
    },
  });

  const handleUpdate = async (values: UserDataSchemaType): Promise<void> => {
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
              error: "Error updating.",
            })
            .then((r) => r);
        })}
      >
        <Card className="rounded-2xl bg-white">
          <CardHeader>
            <CardTitle>Full Name</CardTitle>
            <CardDescription>Update your Full Name.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs" />
                </FormItem>
              )}
              name="name"
              control={form.control}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default NameForm;
