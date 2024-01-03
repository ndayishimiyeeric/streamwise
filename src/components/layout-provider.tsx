"use client";

import { PropsWithChildren, useEffect } from "react";
import { Be_Vietnam_Pro, Inter, Montserrat, Poppins, Roboto_Mono, Ubuntu } from "next/font/google";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UseLayout } from "@/hooks/use-layout";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/components/modal-provider";
import ToastProvider from "@/components/toast-provider";

const be_vietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const LayoutProvider = ({ children }: PropsWithChildren) => {
  const { font, theme, onFontChange, onThemeChange } = UseLayout();
  const { setTheme } = useTheme();
  const user = useCurrentUser();

  const currentFont =
    font === "BE_VIETNAM"
      ? be_vietnam
      : font === "POPPINS"
        ? poppins
        : font === "INTER"
          ? inter
          : font === "UBUNTU"
            ? ubuntu
            : font === "ROBOTO"
              ? roboto
              : font === "MONTSERRAT"
                ? montserrat
                : be_vietnam;

  const currentTheme = theme === "DARK" ? "dark" : theme === "LIGHT" ? "light" : "system";

  useEffect(() => {
    if (user?.settings.font) {
      onFontChange(user?.settings.font);
    }
  }, [user?.settings.font, onFontChange]);

  useEffect(() => {
    if (user?.settings.theme) {
      onThemeChange(user?.settings.theme);
      setTheme(currentTheme);
    }
  }, [user?.settings.theme, onThemeChange, setTheme, currentTheme]);

  return (
    <body className={cn("min-h-screen bg-background antialiased", currentFont.className)}>
      <ModalProvider />
      <ToastProvider />
      <Toaster />
      {children}
    </body>
  );
};
