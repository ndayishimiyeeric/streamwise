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
          className: "w-full items-center justify-start transition-all duration-150 ease-in-out",
        })
      )}
    >
      <Icon className="mr-4 h-5 w-5" />
      <span className="truncate text-base transition-all sm:block">{label}</span>
    </Link>
  );
};
export default SidebarItem;
