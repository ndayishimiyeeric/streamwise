"use client";

import { useTransition } from "react";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export function VisibilityForm() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      isPrivate: user?.isPrivate || undefined,
    },
  });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Stay Anonymous on the Platform</FormLabel>
                <FormDescription>
                  When enabled, your identity will not be shown on leaderboards and you will be
                  listed as &apos;Anonymous&apos; throughout the platform. Your ai models will not
                  be visible to other users.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update visibility
        </Button>
      </form>
    </Form>
  );
}
