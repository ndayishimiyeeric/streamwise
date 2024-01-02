"use client";

import Link from "next/link";
import {
  Bot,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
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
  DropdownMenuShortcut,
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
        <DropdownMenuLabel className="text-base">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/my-ai">
            <DropdownMenuItem>
              <Bot className="mr-2 h-6 w-5" />
              <span className="text-base font-normal">My ai</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={onOPen}>
            <Settings className="mr-2 h-6 w-5" />
            <span className="text-base font-normal">Setting</span>
          </DropdownMenuItem>
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
              <span className="text-base font-normal">Plans</span>
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
