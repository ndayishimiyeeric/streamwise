"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const About = () => {
  return (
    <>
      <section className="container overflow-hidden pb-20 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
          <div className="flex items-center gap-8 lg:gap-32.5">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left relative mx-auto hidden aspect-[588/526.5] xl:block xl:w-1/2"
            >
              <Image
                src="/images/about/about-light-01.png"
                alt="About"
                className="dark:hidden"
                fill
              />
              <Image
                src="/images/about/about-dark-01.png"
                alt="About"
                className="hidden dark:block"
                fill
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: 20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right xl:w-1/2"
            >
              <span className="font-medium uppercase text-black dark:text-white">
                <Badge className="mr-2">New</Badge>
                Argumentation theory
              </span>
              <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                Start modeling in minutes
              </h2>
              <p className="font-normal text-muted-foreground">
                Whether you’re crafting a compelling argument or analyzing a critical theory, our
                tools provide unparalleled support.
              </p>

              <div className="mt-7.5 flex items-center gap-5">
                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-muted bg-card dark:border-muted/40">
                  <p className="text-metatitle2 font-semibold text-black dark:text-white">01</p>
                </div>
                <div className="w-3/4">
                  <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                    Sign up for an account
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Either starting with a free plan or choose a{" "}
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "link",
                          size: "sm",
                          className: "px-0 text-blue-600",
                        })
                      )}
                      href="/#pricing"
                    >
                      Pro plan
                    </Link>
                  </p>
                </div>
              </div>
              <div className="mt-7.5 flex items-center gap-5">
                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-muted bg-card dark:border-muted/40">
                  <p className="text-metatitle2 font-semibold text-black dark:text-white">02</p>
                </div>
                <div className="w-3/4">
                  <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                    Model your theory
                  </h3>
                  <p className="text-base text-muted-foreground">
                    You can model using a GPT based model or a Argumentation theory based model.
                  </p>
                </div>
              </div>
              <div className="mt-7.5 flex items-center gap-5">
                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-muted bg-card dark:border-muted/40">
                  <p className="text-metatitle2 font-semibold text-black dark:text-white">03</p>
                </div>
                <div className="w-3/4">
                  <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                    Export or share your model
                  </h3>
                  <p className="text-base text-muted-foreground">
                    You can export your model Gorgias code or share it with others on the platform.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
