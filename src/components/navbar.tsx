import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { getSubscription } from "@/data/user";
import { User } from "@prisma/client";
import { ArrowRight, BarChartBig, Compass, Layout } from "lucide-react";

import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { NavbarMobileUser } from "@/components/navbar-mobile-user";
import { UserAccountNav } from "@/components/user-account-nav";

async function Navbar() {
  const session = await auth();
  // const subscriptionPlan = await getSubscription();

  // if (!session?.user || !session.user.id) {
  //   dbUser = await db.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });
  // }

  return (
    <nav className="flex items-center border-b bg-background p-4 shadow-sm transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <Link href="/" className="z-40 flex font-semibold">
            <span>Streamwise.</span>
          </Link>

          {session?.user && (
            <div className="items-center space-x-4 sm:flex">
              <Link
                href="/dashboard/usage"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "hidden sm:inline-flex",
                  })
                )}
              >
                <BarChartBig className="mr-1 h-4 w-4" />
                Usage
              </Link>
              <Link
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "hidden sm:inline-flex",
                  })
                )}
                href="/dashboard"
              >
                <Layout className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "hidden sm:inline-flex",
                  })
                )}
                href="/dashboard"
              >
                <Compass className="mr-1 h-4 w-4" />
                Explore
              </Link>
              {/* <UserAccountNav
                imageUrl={session.user.image}
                userName={dbUser?.name}
                subscriptionPlan={subscriptionPlan}
              /> */}
            </div>
          )}

          {!session?.user && (
            <>
              <div className="hidden items-center space-x-4 sm:flex">
                <>
                  <Link
                    href="/pricing"
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })
                    )}
                  >
                    Pricing
                  </Link>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">
                      Get started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              </div>
              <NavbarMobileUser />
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
