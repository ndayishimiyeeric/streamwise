import { create } from "zustand";

interface MobileNavStore {
  isOPen: boolean;
  onOPen: () => void;
  onClose: () => void;
}

export const useMobileNav = create<MobileNavStore>()((set) => ({
  isOPen: false,
  onOPen: () => set({ isOPen: true }),
  onClose: () => set({ isOPen: false }),
}));
