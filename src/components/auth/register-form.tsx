"use client";

import { useState, useTransition } from "react";
import { register } from "@/actions/auth/register";
import { RegisterSchema } from "@/schemas";
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

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setsuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      password: "",
      email: "",
      name: "",
    },
  });

  const handleSubmit = async (inputs: z.infer<typeof RegisterSchema>) => {
    setError(undefined);
    setsuccess(undefined);

    startTransition(() => {
      register(inputs).then((data) => {
        setError(data.error);
        setsuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backbuttonText="Already have an account?"
      backButtonLabel="Login"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <StyledInput {...field} placeholder="Name" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <StyledInput {...field} placeholder="Email" disabled={isPending} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <StyledInput
                      type="password"
                      {...field}
                      placeholder="Password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>
          <div className="flex w-full items-center justify-start md:justify-end">
            <Button className="rounded-full py-6" type="submit" disabled={isPending}>
              Create an account
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
