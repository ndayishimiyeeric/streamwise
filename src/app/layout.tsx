import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import ToastProvider from "@/components/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streamwise",
  description:
    "Streamwise is a platform for stream pdf docs with the help of AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className,
          )}
        >
          <Navbar />
          <ToastProvider />
          {children}
        </body>
      </Providers>
    </html>
  );
}
