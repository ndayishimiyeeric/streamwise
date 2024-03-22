"use client";

import { useTransition } from "react";
import { updateSettings } from "@/actions/auth/settings";
import { AccountSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLanguage } from "@prisma/client";
import { CheckIcon, ChevronsUpDown, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

export function AccountForm() {
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const user = useCurrentUser();

  const defaultValues: Partial<z.infer<typeof AccountSchema>> = {
    name: user?.name || undefined,
    password: undefined,
    new_password: undefined,
    language: user?.language || undefined,
    email: user?.email || undefined,
    isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
  };
  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues,
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
    form.setValue("password", undefined);
    form.setValue("new_password", undefined);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="email address"
                  type="email"
                  disabled={user?.isOAuth || isPending}
                  aria-readonly={user?.isOAuth || isPending}
                />
              </FormControl>
              <FormDescription>
                {!user?.isOAuth &&
                  "This is your primary email address. You can only change this once every 30 days."}
                {user?.isOAuth &&
                  "You registered using an OAuth provider, you cannot change your email."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {user?.isOAuth === false && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      {...field}
                      type="password"
                      disabled={user?.isOAuth || isPending}
                      aria-readonly={user?.isOAuth || isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    If you want to change your password, please enter your current password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      {...field}
                      type="password"
                      disabled={user?.isOAuth || isPending}
                      aria-readonly={user?.isOAuth || isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    If you want to change your password, please enter your new password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Two-factor authentication</FormLabel>
                    <FormDescription>
                      Enable Two-factor authentication add an extra layer of security on your
                      account {user?.email}.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={user?.isOAuth || isPending}
                      aria-readonly={user?.isOAuth || isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? Object.values(UserLanguage).find((language) => language === field.value)
                        : "Select language"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {Object.values(UserLanguage).map((language) => (
                        <CommandItem
                          value={language}
                          disabled={isPending}
                          key={language}
                          onSelect={() => {
                            form.setValue("language", language);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              language === field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {language}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used on the platform.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update account
        </Button>
      </form>
    </Form>
  );
}
