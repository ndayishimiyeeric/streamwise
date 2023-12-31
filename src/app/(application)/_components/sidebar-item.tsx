"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type SidebarItemProps = {
  icon: IconType | LucideIcon;
  label: string;
  path: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path }) => {
  const pathname = usePathname();

  const isActive = pathname.includes(path);

  return (
    <Link
      href={path}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size: "default",
          className: "w-full items-center justify-start",
        })
      )}
    >
      <Icon className="mr-4 h-4 w-4" />
      <span className="truncate sm:block">{label}</span>
    </Link>
  );
};
export default SidebarItem;
