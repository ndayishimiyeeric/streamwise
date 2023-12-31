import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import React from "react";
import { cn } from "@/lib/utils";

export function NavbarMobileUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="sm:hidden" asChild>
        <HiOutlineMenuAlt3 className="w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 sm:hidden" align="end" forceMount>
        <DropdownMenuGroup>
          <Link href="/pricing">
            <DropdownMenuItem className="cursor-pointer">
              Pricing
            </DropdownMenuItem>
          </Link>
          <Link href="sign-in">
            <DropdownMenuItem className="cursor-pointer">
              Sign In
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          className={cn(
            buttonVariants({
              size: "sm",
              className: "w-full",
            }),
          )}
          href="/sign-up"
        >
          Get Started
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
