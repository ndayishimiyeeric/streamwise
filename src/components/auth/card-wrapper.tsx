"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Social } from "@/components/auth/social";
import { styles } from "@/app/(marketing)/_components/styles";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backbuttonText?: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backbuttonText,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -20,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true }}
        className="animate_top rounded-lg bg-background px-7.5 pt-7.5 shadow-solid-4 dark:shadow-solid-8 xl:px-15 xl:pt-15"
      >
        <h2 className={cn(styles.heading2, "mb-15 text-center text-primary")}>{headerLabel}</h2>
        {showSocial && <Social />}
        {showSocial && (
          <div className="my-12 flex items-center justify-center lg:mx-auto lg:max-w-md">
            <Separator className="hidden max-w-[200px] sm:block" />
            <p className="w-full px-5 text-center text-base text-primary">OR</p>
            <Separator className="hidden max-w-[200px] sm:block" />
          </div>
        )}
        {children}
        <div className="mt-10 border-t py-5 text-center">
          <p className="text-sm">
            {backbuttonText}
            <Button size="sm" variant="link" className="font-normal" asChild>
              <Link href={backButtonHref}>{backButtonLabel}</Link>
            </Button>
          </p>
        </div>
      </motion.div>
    </>
  );
};
