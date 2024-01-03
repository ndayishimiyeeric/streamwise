"use client";

import { useTransition } from "react";
import { appearance } from "@/actions/auth/appearance";
import { AppearanceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFont, UserTheme } from "@prisma/client";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AppearanceForm() {
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const user = useCurrentUser();

  const defaultValues: Partial<z.infer<typeof AppearanceSchema>> = {
    theme: user?.settings.theme || undefined,
    font: user?.settings.font || undefined,
  };
  const form = useForm<z.infer<typeof AppearanceSchema>>({
    resolver: zodResolver(AppearanceSchema),
    defaultValues,
  });

  function onSubmit(input: z.infer<typeof AppearanceSchema>) {
    startTransition(() => {
      appearance(input)
        .then((data) => {
          if (data.error) {
            toast("Appeance settings update status", {
              description: (
                <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
                  <code className="text-primary-foreground">
                    {JSON.stringify(data.error, null, 2)}
                  </code>
                </pre>
              ),
            });
          }
          if (data.success) {
            update();
            toast("Appeance settings update status", {
              description: (
                <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
                  <code className="text-primary-foreground">
                    {JSON.stringify(
                      { success: data.success, font: input.font, theme: input.theme },
                      null,
                      2
                    )}
                  </code>
                </pre>
              ),
            });
          }
        })
        .catch(() => {
          toast("Appeance settings update status", {
            description: (
              <pre className="mt-2 w-[320px] rounded-md bg-primary p-4">
                <code className="text-primary-foreground">
                  {JSON.stringify({ error: "Something went wrong!" }, null, 2)}
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
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Families</SelectLabel>
                      {Object.values(UserFont).map((font) => (
                        <SelectItem
                          key={font}
                          value={font}
                          disabled={isPending || field.value === font}
                        >
                          {font}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Set the font you want to use on the platform.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>Select the theme for the dashboard.</FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid gap-8 pt-2 sm:max-w-md sm:grid-cols-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem
                        value={UserTheme.LIGHT}
                        disabled={isPending}
                        className="sr-only"
                      />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">Light</span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem
                        value={UserTheme.DARK}
                        disabled={isPending}
                        className="sr-only"
                      />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-black p-2">
                        <div className="space-y-2 rounded-md bg-[#27272A] p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-white/95" />
                          <div className="h-2 w-[100px] rounded-lg bg-white/95" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-[#27272A] p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-white/95" />
                          <div className="h-2 w-[100px] rounded-lg bg-white/95" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-[#27272A] p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-white/95" />
                          <div className="h-2 w-[100px] rounded-lg bg-white/95" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">Dark</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update preferences
        </Button>
      </form>
    </Form>
  );
}
