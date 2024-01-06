import React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  Component?: React.FC;
  idName?: string;
  className?: string;
}

const SectionWrapper = ({ Component, idName, className }: SectionWrapperProps) => {
  function HOC() {
    const RenderComponent = Component ? <Component /> : null;
    return (
      <>
        <span id={idName} className="hash-span">
          &nbsp;
        </span>
        {RenderComponent}
      </>
    );
  }
  return HOC;
};

export default SectionWrapper;
