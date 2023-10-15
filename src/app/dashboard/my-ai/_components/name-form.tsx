"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { MyAiBioType } from "@/lib/validators/my-ai";
import getSubscription from "@/lib/actions";
import { AiData } from "@prisma/client";
import { Button } from "@/components/ui/button";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
  aiData: AiData;
};

function NameForm({ aiData, subscriptionPlan }: Props) {
  const form = useForm<MyAiBioType>({
    defaultValues: {
      name: aiData.name || "",
      bio: aiData.bio || "",
      imgUrl: aiData.imgUrl || "",
    },
  });

  return (
    <Form {...form}>
      <form>
        <Card className="rounded-2xl bg-white">
          <CardHeader>
            <CardTitle>{aiData.name}&apos;s Name</CardTitle>
            <CardDescription>
              Customize the name of your AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              render={() => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder={`${aiData.name}'s Name`}
                    />
                  </FormControl>
                </FormItem>
              )}
              name="name"
              control={form.control}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Save</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default NameForm;
