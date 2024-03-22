import React from "react";
import { motion } from "framer-motion";

import { Feature } from "./featuresData";

export const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon: Icon, title, description } = feature;

  return (
    <>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -10,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="animate_top z-40 rounded-lg bg-card p-7.5 text-card-foreground shadow-lg transition-all dark:border xl:p-12.5"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/25 shadow-sm dark:bg-primary/10">
          <Icon width={36} height={36} className="text-white" />
        </div>
        <h3 className="mb-5 mt-7.5 text-xl font-bold xl:text-itemtitle">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>
    </>
  );
};
