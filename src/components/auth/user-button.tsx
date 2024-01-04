"use client";

import Link from "next/link";
import {
  Bot,
  CreditCard,
  Fingerprint,
  Github,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Palette,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Wallet,
} from "lucide-react";
import { FaUser } from "react-icons/fa";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useSettings } from "@/hooks/use-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogoutButton } from "./logout-button";

export const UserButton = () => {
  const user = useCurrentUser();
  const { onOPen } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="bg-muted">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="text-base">{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/my-ai">
            <DropdownMenuItem>
              <Bot className="mr-2 h-6 w-5" />
              <span className="text-base font-normal">Custom instrutions</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings className="mr-2 h-4 w-4" />
              <span className="text-base font-normal">Settings & Beta</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <Link href="/profile/account">
                  <DropdownMenuItem>
                    <Fingerprint className="mr-2 h-4 w-4" />
                    <span className="text-base font-normal">Account</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span className="text-base font-normal">Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile/appearance">
                  <DropdownMenuItem>
                    <Palette className="mr-2 h-4 w-4" />
                    <span className="text-base font-normal">Appearance</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-6 w-5" />
            <span className="text-base font-normal">Billing</span>
          </DropdownMenuItem>
          <Link href="/upgrade">
            <DropdownMenuItem>
              <Wallet className="mr-2 h-6 w-5" />
              <span className="text-base font-normal">My Plan</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="https://github.com/ndayishimiyeeric" target="_blank">
          <DropdownMenuItem>
            <Github className="mr-2 h-6 w-5" />
            <span className="text-base font-normal">GitHub</span>
          </DropdownMenuItem>
        </Link>
        <Link href="mailto:dev.nderic@outlook.com">
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-6 w-5" />
            <span className="text-base font-normal">Support</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-6 w-5" />
            <span className="text-base font-normal">Log out</span>
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
