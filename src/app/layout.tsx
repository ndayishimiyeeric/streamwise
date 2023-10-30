import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import ToastProvider from "@/components/toast-provider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    <ClerkProvider>
      <html lang="en" className="light">
        <Providers>
          <body
            className={cn("min-h-screen antialiased grainy", poppins.className)}
          >
            <Navbar />
            <ToastProvider />
            {children}
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
}
