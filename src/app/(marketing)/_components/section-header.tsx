"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { styles } from "./styles";

type HeaderInfo = {
  title: string;
  subtitle: string;
  description: string;
};

export const SectionHeader = ({ headerInfo }: { headerInfo: HeaderInfo }) => {
  const { title, subtitle, description } = headerInfo;

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
        className="animate_top mx-auto text-center"
      >
        <Badge className="mb-4 px-4.5 py-1.5 font-medium">{title}</Badge>
        <h2
          className={cn(
            styles.heading2,
            "mx-auto mb-4 text-black dark:text-white md:w-4/5 xl:w-1/2"
          )}
        >
          {subtitle}
        </h2>
        <p className={cn(styles.paragraph, "mx-auto md:w-4/5 lg:w-3/5 xl:w-[46%]")}>
          {description}
        </p>
      </motion.div>
    </>
  );
};
