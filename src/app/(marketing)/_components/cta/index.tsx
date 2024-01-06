"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { styles } from "../styles";

export const CTA = () => {
  return (
    <>
      {/* <!-- ===== CTA Start ===== --> */}
      <section
        className={cn(
          styles.flexCenter,
          styles.marginY,
          styles.padding,
          " dark:bg-black-gradient-2 container z-30 max-w-5xl flex-col items-start justify-between gap-3 rounded-[20px] bg-[#EEF1FF]/20 shadow-lg backdrop-blur-xl lg:flex-row lg:items-center"
        )}
      >
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
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_left flex flex-1 flex-col"
        >
          <h2 className={cn(styles.heading2, "text-black dark:text-white")}>
            Let’s try our platform now
          </h2>
          <p className={cn(styles.paragraph, "mt-5 max-w-[470px]")}>
            Unlock the Power of AI - Start Your Journey with Streamwise Today!
          </p>
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
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className={cn(styles.flexCenter, "animate_right ml-0 mt-10 sm:mt-0")}
        >
          <Button size="lg" className="rounded-full p-8 text-base">
            Get Started
          </Button>
        </motion.div>
      </section>
      {/* <!-- ===== CTA End ===== --> */}
    </>
  );
};
