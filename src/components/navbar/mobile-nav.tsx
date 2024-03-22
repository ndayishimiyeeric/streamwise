"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMobileNav } from "@/hooks/use-mobile-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AppLogo from "@/components/app-logo";
import { LoginButton } from "@/components/auth/login-button";

import menuData from "./menuData";

export const MobileNav = () => {
  const { isOPen, onClose, onOPen } = useMobileNav();
  const pathname = usePathname();
  const user = useCurrentUser();

  React.useEffect(() => {
    onClose();
  }, [onClose, pathname]);

  return (
    <>
      <Button className="lg:ml-auto lg:hidden" variant="ghost" size="icon" onClick={onOPen}>
        <PanelLeft size={24} />
      </Button>
      <Sheet open={isOPen} onOpenChange={onClose}>
        <SheetContent className="lg:hidden" side="left">
          <div className="border-b pb-6 pt-4">
            <AppLogo className="w-32" />
          </div>
          <div className="flex flex-col gap-y-3 p-0">
            {menuData.map((menuItem) => (
              <Link
                scroll
                key={menuItem.id}
                href={menuItem.path}
                className={cn(
                  buttonVariants({
                    variant: "link",
                    size: "lg",
                    className: "w-full items-center justify-start py-8",
                  })
                )}
                onClick={onClose}
              >
                <span className="truncate sm:block sm:text-sm md:text-lg">{menuItem.title}</span>
              </Link>
            ))}
          </div>
          <div>
            {user ? (
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard">Dasboard</Link>
              </Button>
            ) : (
              <LoginButton mode="modal" asChild>
                <Button size="lg" className="w-full">
                  Sign in
                </Button>
              </LoginButton>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
