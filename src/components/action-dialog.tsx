"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from "@fluentui/react-components";
import { Loader2 } from "lucide-react";

import { useActionDialog } from "@/hooks/use-action-dialog";

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
      <Dialog open={isOPen} onOpenChange={onClose}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{description}</DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" disabled={isLoading} onClick={onClose}>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={actionHandler} disabled={isLoading}>
                Delete
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
