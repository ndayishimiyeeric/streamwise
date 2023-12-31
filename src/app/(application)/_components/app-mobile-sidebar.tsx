"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import AppSidebar from "./app-sidebar";

type MobileSidebarProps = {};

const MobileSidebar: React.FC<MobileSidebarProps> = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();

  const { isOPen, onOPen, onClose } = useMobileSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) return null;

  return (
    <>
      <Button className="inline-flex lg:hidden" variant="ghost" size="sm" onClick={onOPen}>
        <Menu size={24} />
      </Button>
      <Sheet open={isOPen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>
    </>
  );
};
export default MobileSidebar;
