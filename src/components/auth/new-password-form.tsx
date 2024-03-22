"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth/new-password";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { StyledInput } from "../form/styled-input";

export const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setsuccess] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const code = searchParams.get("code") || undefined;

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = async (input: z.infer<typeof NewPasswordSchema>) => {
    setError(undefined);
    setsuccess(undefined);

    startTransition(() => {
      newPassword(input, code).then((data) => {
        setError(data?.error);
        setsuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <StyledInput
                      {...field}
                      placeholder="New password"
                      disabled={isPending}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-auto min-w-fit rounded-full px-4 py-6"
              type="submit"
              disabled={isPending}
            >
              Reset password
            </Button>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
        </form>
      </Form>
    </CardWrapper>
  );
};
