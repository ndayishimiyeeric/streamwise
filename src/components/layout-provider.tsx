"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import * as React from "react";
import { Be_Vietnam_Pro, Inter, Montserrat, Poppins, Roboto_Mono, Ubuntu } from "next/font/google";
import { useServerInsertedHTML } from "next/navigation";
import {
  BrandVariants,
  createDarkTheme,
  createDOMRenderer,
  createLightTheme,
  FluentProvider,
  RendererProvider,
  renderToStyleElements,
  SSRProvider,
  Theme,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
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

  useEffect(() => {
    if (user?.settings.font) {
      onFontChange(user?.settings.font);
    }
  }, [user?.settings.font, onFontChange]);
  const [renderer] = useState(() => createDOMRenderer());
  const streamwise: BrandVariants = {
    10: "#030303",
    20: "#171818",
    30: "#252728",
    40: "#303334",
    50: "#3B3F41",
    60: "#474C4E",
    70: "#53595C",
    80: "#5F6769",
    90: "#6C7578",
    100: "#798386",
    110: "#869195",
    120: "#959FA3",
    130: "#A5AEB1",
    140: "#B5BCBF",
    150: "#C6CBCD",
    160: "#D6DADB",
  };

  const lightTheme: Theme = {
    ...createLightTheme(streamwise),
  };

  const darkTheme: Theme = {
    ...createDarkTheme(streamwise),
  };

  darkTheme.colorBrandForeground1 = streamwise[110];
  darkTheme.colorBrandForeground2 = streamwise[120];

  const currentTheme =
    user?.settings.theme === "DARK"
      ? webDarkTheme
      : theme === "LIGHT"
        ? webLightTheme
        : webLightTheme;

  const currentThemeName = theme === "DARK" ? "dark" : theme === "LIGHT" ? "light" : "light";

  useEffect(() => {
    if (user?.settings.theme) {
      onThemeChange(user?.settings.theme);
      setTheme(currentThemeName);
    }
  }, [user?.settings.theme, onThemeChange, currentThemeName, setTheme]);

  useServerInsertedHTML(() => {
    return <>{renderToStyleElements(renderer)}</>;
  });

  return (
    <body>
      <ModalProvider />
      <ToastProvider />
      <Toaster />
      <RendererProvider renderer={renderer}>
        <SSRProvider>
          <FluentProvider theme={currentTheme}>
            <div className={cn("min-h-screen antialiased", currentFont.className)}>{children}</div>
          </FluentProvider>
        </SSRProvider>
      </RendererProvider>
    </body>
  );
};
