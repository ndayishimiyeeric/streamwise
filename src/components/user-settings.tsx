"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useSettings } from "@/hooks/use-settings";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/theme-toggle";

import { UserAccountNav } from "./user-account-nav";

const UserSettings = () => {
  const pathname = usePathname();
  const { isOPen, onClose } = useSettings();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <Dialog open={isOPen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Subscription & data</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Manage your subscription and data.
            </span>
          </div>
          <UserAccountNav />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Select your a custom theme on your device.
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;
