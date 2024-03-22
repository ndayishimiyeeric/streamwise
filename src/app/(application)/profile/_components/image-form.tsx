"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/actions/auth/settings";
import { AccountSchema } from "@/schemas";
import { Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import * as z from "zod";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUploadButton } from "@/components/file-upload-button";

export const ImageForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const user = useCurrentUser();
  const { update } = useSession();

  const handleUpload = (input: z.infer<typeof AccountSchema>) => {
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

    router.refresh();
  };
  return (
    <div className="space-y-3">
      <Label className="flex items-center">
        Profile Picture
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="ml-1 h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Publicly visible. Max size 4 Mb</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <div className="flex items-center space-x-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.image!} alt={user?.name!} />
          <AvatarFallback>SW</AvatarFallback>
        </Avatar>
        <FileUploadButton endpoint="imageUploader" size="sm" onChange={handleUpload} />
      </div>
    </div>
  );
};
