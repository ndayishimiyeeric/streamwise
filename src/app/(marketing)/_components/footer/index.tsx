"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex flex-col flex-wrap items-center justify-center gap-5 py-7 lg:flex-row lg:justify-between lg:gap-0">
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
            className="animate_top"
          >
            <div className="flex items-center gap-8">
              <Link
                href=""
                className={cn(buttonVariants({ variant: "link", className: "text-base" }))}
              >
                Privacy Policy
              </Link>
              <Link
                href=""
                className={cn(buttonVariants({ variant: "link", className: "text-base" }))}
              >
                Support
              </Link>
            </div>
          </motion.div>

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
            className="animate_top"
          >
            <p>&copy; {new Date().getFullYear()} Streamwise. All rights reserved</p>
          </motion.div>

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
            className="animate_top"
          >
            <div className="flex items-center gap-5">
              <Link href="#" aria-label="social icon" className="parent-container">
                <FaXTwitter className="icon h-6 w-6" />
              </Link>
              <Link href="#" aria-label="social icon" className="parent-container">
                <FaInstagram className="icon h-6 w-6" />
              </Link>
              <Link href="#" aria-label="social icon" className="parent-container">
                <FaGithub className="icon h-6 w-6" />
              </Link>
              <Link href="#" aria-label="social icon" className="parent-container">
                <Linkedin className="icon h-6 w-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
