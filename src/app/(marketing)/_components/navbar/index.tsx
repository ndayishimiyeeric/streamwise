"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button, buttonVariants } from "@/components/ui/button";
import AppLogo from "@/components/app-logo";
import { LoginButton } from "@/components/auth/login-button";
import { UserButton } from "@/components/auth/user-button";

import { styles } from "../styles";
import menuData from "./menuData";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";

export const PublicNavbar = () => {
  const user = useCurrentUser();

  const [stickyMenu, setStickyMenu] = useState(false);

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  return (
    <>
      <div
        className={cn(
          " fixed inset-x-0 z-50 bg-background",
          `${styles.paddingX} ${styles.flexCenter}`,
          stickyMenu && "z-50 border-b bg-background shadow-md backdrop-blur-md"
        )}
      >
        <div className={`${styles.boxWidth}`}>
          <nav className="navbar flex w-full items-center justify-between py-6">
            <AppLogo className="w-32 flex-shrink-0" />
            <MobileNav />

            <div className="hidden flex-1 list-none items-center justify-end gap-x-3 lg:flex">
              {menuData.map((link) => (
                <Link
                  key={link.id}
                  href={`${link.path}`}
                  className={cn(buttonVariants({ variant: "link" }))}
                >
                  {link.title}
                </Link>
              ))}
              <ModeToggle />
              {user ? (
                <UserButton />
              ) : (
                <LoginButton mode="modal" asChild>
                  <Button size="lg" className="rounded-full">
                    Sign in
                  </Button>
                </LoginButton>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
