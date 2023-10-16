import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import getSubscription from "@/lib/actions";
import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

type Props = {
  subscriptionPlan: Awaited<ReturnType<typeof getSubscription>>;
};

export async function UserAccountNav({ subscriptionPlan }: Props) {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-5 w-5">
            <UserIcon className="h-5 w-5" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.given_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
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
          <Link href="/dashboard/billing">
            <DropdownMenuItem className="cursor-pointer">
              Billing
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/my-ai">
            <DropdownMenuItem className="cursor-pointer">
              My AI
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutLink>
          <DropdownMenuItem className="cursor-pointer">
            Log out
          </DropdownMenuItem>
        </LogoutLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
