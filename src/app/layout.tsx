import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { cn } from "@/lib/utils";
import Providers from "@/components/providers";

import "@/styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import ModalProvider from "@/components/modal-provider";
import { ThemeProvider } from "@/components/theme-provider";
import ToastProvider from "@/components/toast-provider";

const poppins = Be_Vietnam_Pro({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Streamwise",
  description: "Streamwise is a platform for stream pdf docs with the help of AI.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="streamwise-theme-site"
          >
            <body className={cn("min-h-screen bg-background antialiased", poppins.className)}>
              <ModalProvider />
              <ToastProvider />
              {children}
            </body>
          </ThemeProvider>
        </Providers>
      </html>
    </SessionProvider>
  );
}
