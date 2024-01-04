"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { useActionDialog } from "@/hooks/use-action-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionDialogProps {
  actionHandler: () => void;
  description: string;
  title: string;
  isLoading?: boolean;
}

export const ActionDialog = ({
  actionHandler,
  description,
  title,
  isLoading,
}: ActionDialogProps) => {
  const { isOPen, onClose } = useActionDialog();
  const [isMouted, setIsMouted] = useState(false);

  useEffect(() => {
    setIsMouted(true);
  }, []);

  if (!isMouted) return null;

  return (
    <>
      <Dialog onOpenChange={onClose} open={isOPen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-start">
            <div className="w-full space-x-3">
              <Button
                type="button"
                variant="default"
                onClick={actionHandler}
                disabled={isLoading}
                size="sm"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
