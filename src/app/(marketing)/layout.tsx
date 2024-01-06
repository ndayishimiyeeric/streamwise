"use client";

import React, { PropsWithChildren } from "react";

import { PublicNavbar } from "./_components/navbar";

import "./marketing.css";

import { Footer } from "./_components/footer";
import { Lines } from "./_components/lines";
import ScrollToTop from "./_components/scrollToTop";

const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="relative min-h-screen">
      <Lines />
      <PublicNavbar />
      {children}
      <Footer />
      <ScrollToTop />
    </main>
  );
};
export default MarketingLayout;
