import React from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  getKindeServerSession,
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import { UserAccountNav } from "@/components/user-account-nav";
import { getSubscription } from "@/lib/actions";

async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const subscriptionPlan = await getSubscription();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Streamwise.</span>
          </Link>
          {/*  TODO Mobile Navbar  */}

          {user && (
            <div className="items-center space-x-4 sm:flex">
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "hidden sm:flex",
                  }),
                )}
              >
                Pricing
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
              <UserAccountNav subscriptionPlan={subscriptionPlan} />
            </div>
          )}

          {!user && (
            <div className="items-center space-x-4 sm:flex">
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
                <LoginLink
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                  )}
                >
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={cn(
                    buttonVariants({
                      size: "sm",
                    }),
                  )}
                >
                  Get started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </RegisterLink>
              </>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
