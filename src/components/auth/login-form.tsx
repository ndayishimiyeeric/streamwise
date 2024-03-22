"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "@/actions/auth/login";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { StyledInput } from "@/components/form/styled-input";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : undefined;
  const callBackUrl = searchParams.get("callBackUrl");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setsuccess] = useState<string | undefined>("");
  const [showTwoFactor, setshowTwoFactor] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const handleSubmit = async (inputs: z.infer<typeof LoginSchema>) => {
    setError(undefined);
    setsuccess(undefined);

    startTransition(() => {
      login(inputs, callBackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setsuccess(data.success);
          }

          if (data?.twoFactor) {
            setshowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Sign in to your account"
      backbuttonText="Don't have an account?"
      backButtonLabel="Sign up"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
          {!showTwoFactor && (
            <div className="flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <StyledInput
                        {...field}
                        type="email"
                        placeholder="Email"
                        disabled={isPending}
                      />
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
          )}
          {showTwoFactor && (
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <StyledInput {...field} placeholder="Code" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
          </div>

          <div className="flex flex-wrap items-center gap-10 md:justify-between xl:gap-15">
            <div className="flex flex-wrap gap-4 md:gap-10">
              <Button size="sm" variant="link" className="px-0 font-normal" asChild>
                <Link href="/auth/reset">Forgot password?</Link>
              </Button>
            </div>

            <Button className="rounded-full py-6" size="lg" type="submit" disabled={isPending}>
              {showTwoFactor ? "Confirm" : "Sign in"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
