import React from "react";
import { ArrowRight, GithubIcon, Loader2, Slack } from "lucide-react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";

function Page() {
  return (
    <MaxWidthWrapper>
      <div className="relative w-full h-[calc(100vh-3.5rem)] flex justify-center items-center">
        <div className="absolute top-1/2  flex flex-col items-center gap-2">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-6">
                <Button variant="outline">
                  <GithubIcon className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button variant="outline">
                  <Slack className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <RegisterLink className={cn(buttonVariants(), "w-full")}>
                Create account
              </RegisterLink>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export default Page;
