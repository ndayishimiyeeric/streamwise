import { UserFont, UserTheme } from "@prisma/client";
import { create } from "zustand";

interface UseLayoutStore {
  font: UserFont | null;
  theme: UserTheme | null;
  onFontChange: (font: UserFont) => void;
  onThemeChange: (theme: UserTheme) => void;
}

export const UseLayout = create<UseLayoutStore>()((set) => ({
  font: null,
  theme: null,
  onFontChange: (font) => set({ font }),
  onThemeChange: (theme) => set({ theme }),
}));
