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
import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import UserAvatar from "@/components/ui/user-avatar";
import { Diamond, Gem } from "lucide-react";

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
  const { getUser } = getKindeServerSession();
  const user = getUser();
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
        <LogoutLink>
          <DropdownMenuItem className="cursor-pointer">
            Log out
          </DropdownMenuItem>
        </LogoutLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
