"use client";

import Image from "next/image";
import { Bot } from "lucide-react";

import { cn } from "@/lib/utils";

import { styles } from "../styles";

const Hero = () => {
  return (
    <>
      <section className={cn("container pt-20", styles.flexStart)}>
        <div className={cn(styles.boxWidth)}>
          <div className={cn("flex flex-col md:flex-row", styles.paddingY)}>
            <div className={cn("flex-1 flex-col px-6 sm:px-16 xl:px-0", styles.flexStart)}>
              <div className="dark:bg-muted-gradient bg-white__gradient mb-2 flex flex-row items-center rounded-[10px] px-4 py-[6px]">
                <Bot className="h-[32px] w-[32px] text-white/80" />
                <p className={cn(styles.paragraph, "ml-2 text-white/80")}>Streamwise is public!</p>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <h1 className="mb-5 max-w-[470px] flex-1 text-[52px] font-semibold leading-[75px] text-black dark:text-white">
                  Revolutionizing Critical Thinking with AI
                </h1>
              </div>
              <p className={cn(styles.paragraph, "max-w-[470px]")}>
                At Streamwise, we&apos;re pioneering the future of argumentation and intelligent
                reasoning. Our platform is designed for thinkers, innovators, and seekers of
                knowledge.
              </p>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-01.png"
                  alt="shape"
                  width={46}
                  height={246}
                  className="absolute -left-11.5 top-0"
                />
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className=" relative aspect-[700/444] w-full">
                  <Image
                    className="shadow-solid-l dark:hidden"
                    src="/images/hero/hero-light.svg"
                    alt="Hero"
                    fill
                  />
                  <Image
                    className="hidden shadow-solid-l dark:block"
                    src="/images/hero/hero-dark.svg"
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
