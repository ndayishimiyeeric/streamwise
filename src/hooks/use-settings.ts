import { create } from "zustand";

interface SettingsStore {
  isOPen: boolean;
  onOPen: () => void;
  onClose: () => void;
}

export const useSettings = create<SettingsStore>()((set) => ({
  isOPen: false,
  onOPen: () => set({ isOPen: true }),
  onClose: () => set({ isOPen: false }),
}));
