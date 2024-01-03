"use client";

import { useTransition } from "react";
import { updateSettings } from "@/actions/setting";
import { AccountSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm() {
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const { update } = useSession();

  const defaultValues: Partial<z.infer<typeof AccountSchema>> = {
    bio: user?.bio || undefined,
    username: user?.username || undefined,
  };
  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues,
  });

  const updateUsername = !user?.updateUsername || new Date(user?.updateUsername) < new Date();

  function onSubmit(input: z.infer<typeof AccountSchema>) {
    startTransition(() => {
      updateSettings(input)
        .then((data) => {
          if (data.error) {
            toast("Settings update status", {
              description: (
                <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
                  <code className="text-primary-foreground">
                    {JSON.stringify({ error: data.error }, null, 2)}
                  </code>
                </pre>
              ),
            });
          }

          if (data.success) {
            update();
            toast("Settings update status", {
              description: (
                <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
                  <code className="text-primary-foreground">
                    {JSON.stringify({ sussess: data.success }, null, 2)}
                  </code>
                </pre>
              ),
            });
          }
        })
        .catch(() => {
          toast("Settings update status", {
            description: (
              <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
                <code className="text-primary-foreground">
                  {JSON.stringify({ error: "Something went wrong" }, null, 2)}
                </code>
              </pre>
            ),
          });
        });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe"
                  {...field}
                  disabled={!updateUsername || isPending}
                  aria-readonly={!updateUsername || isPending}
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym. You can
                only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  disabled={isPending}
                  aria-readonly={isPending}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                More about you this can be used to improve ai suggestions for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
