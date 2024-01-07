"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraphData } from "@/data/user";
import { UserUsage } from "@prisma/client";
import { MessagesSquare, UploadCloud } from "lucide-react";
import { PiBookOpenBold } from "react-icons/pi";
import { TbPlant2 } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Overview from "@/components/overview";

type Props = {
  userUsage: UserUsage;
  graphData: GraphData[];
};

function ClientPage({ userUsage, graphData }: Props) {
  const router = useRouter();

  return <div>Usage page</div>;
}

export default ClientPage;
