import { auth, currentUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Gem, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSubscription } from "@/lib/actions";
import UserAvatar from "@/components/ui/user-avatar";
import React from "react";

type Props = {
  userName?: string;
  imageUrl?: string;
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

export async function UserAccountNav({
  subscriptionPlan,
  imageUrl,
  userName,
}: Props) {
  const user = await currentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar userName={userName!} imageUrl={imageUrl!} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userName ?? user?.firstName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard" className="block w-full sm:hidden">
            <DropdownMenuItem className="cursor-pointer">
              Dashboard
            </DropdownMenuItem>
          </Link>
          <Link href="/pricing" className="block w-full sm:hidden">
            <DropdownMenuItem className="cursor-pointer">
              Pricing
            </DropdownMenuItem>
          </Link>
          <Link
            href={`${
              subscriptionPlan.name === "Free"
                ? "/upgrade"
                : "/dashboard/billing"
            }`}
          >
            <DropdownMenuItem className="cursor-pointer">
              {subscriptionPlan.name === "Free" ? (
                <>
                  Upgrade <Gem className="w-4 h-4 ml-2 text-[#BF953F]" />
                </>
              ) : (
                "Billing"
              )}
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/usage" className="block w-full sm:hidden">
            <DropdownMenuItem className="cursor-pointer">
              Usage
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/me">
            <DropdownMenuItem className="cursor-pointer">
              My Account
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/my-ai">
            <DropdownMenuItem className="cursor-pointer">
              My AI
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton>
          <Button variant="ghost" size="sm" className="w-full">
            Sign out
            <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
