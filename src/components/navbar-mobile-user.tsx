import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { ArrowRight, MenuIcon, MenuSquare } from "lucide-react";
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
          <LoginLink>
            <DropdownMenuItem className="cursor-pointer">
              Sign In
            </DropdownMenuItem>
          </LoginLink>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <RegisterLink
          className={cn(
            buttonVariants({
              size: "sm",
              className: "w-full",
            }),
          )}
        >
          <DropdownMenuItem className="cursor-pointer">
            Get Started
            <ArrowRight className="h-5 w-5 ml-2" />
          </DropdownMenuItem>
        </RegisterLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
