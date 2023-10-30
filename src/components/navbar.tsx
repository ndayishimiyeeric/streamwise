import React from "react";
import { User } from ".prisma/client";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAccountNav } from "@/components/user-account-nav";
import { getSubscription } from "@/lib/actions";
import { db } from "@/lib/db";
import { NavbarMobileUser } from "@/components/navbar-mobile-user";

async function Navbar() {
  const { userId } = auth();
  const user = await currentUser();
  const subscriptionPlan = await getSubscription();

  let dbUser: User | null = null;

  if (userId && user) {
    dbUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Streamwise.</span>
          </Link>

          {user && (
            <div className="items-center space-x-4 sm:flex">
              <Link
                href="/dashboard/usage"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "hidden sm:flex",
                  }),
                )}
              >
                Usage
              </Link>
              <Link
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "hidden sm:flex",
                  }),
                )}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <UserAccountNav
                imageUrl={dbUser?.imgUrl}
                userName={dbUser?.name}
                subscriptionPlan={subscriptionPlan}
              />
            </div>
          )}

          {!user && (
            <>
              <div className="hidden items-center space-x-4 sm:flex">
                <>
                  <Link
                    href="/pricing"
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      }),
                    )}
                  >
                    Pricing
                  </Link>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">
                      Get started
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </SignUpButton>
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
