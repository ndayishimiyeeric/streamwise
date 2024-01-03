import type { Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import Providers from "@/components/providers";

import "@/styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import { LayoutProvider } from "@/components/layout-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ourFileRouter } from "@/app/api/uploadthing/core";

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
            defaultTheme={(session?.user?.settings.theme === "DARK" ? "dark" : "light") || "system"}
            enableSystem
            disableTransitionOnChange
            storageKey="streamwise-theme-site"
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <LayoutProvider>{children}</LayoutProvider>
          </ThemeProvider>
        </Providers>
      </html>
    </SessionProvider>
  );
}
