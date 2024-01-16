"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraphData } from "@/data/user";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from "@fluentui/react-components";
import { UserUsage } from "@prisma/client";
import { MessagesSquare, UploadCloud } from "lucide-react";
import { PiBookOpenBold } from "react-icons/pi";
import { TbPlant2 } from "react-icons/tb";

// import { Button } from "@/components/ui/button";
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

  return (
    <div>
      <Dialog>
        <DialogTrigger disableButtonEnhancement>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam exercitationem
              cumque repellendus eaque est dolor eius expedita nulla ullam? Tenetur reprehenderit
              aut voluptatum impedit voluptates in natus iure cumque eaque?
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
              <Button appearance="primary">Do Something</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}

export default ClientPage;
