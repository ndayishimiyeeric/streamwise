import { create } from "zustand";

interface MobileSidebarStore {
  isOPen: boolean;
  onOPen: () => void;
  onClose: () => void;
}

export const useMobileSidebar = create<MobileSidebarStore>()((set) => ({
  isOPen: false,
  onOPen: () => set({ isOPen: true }),
  onClose: () => set({ isOPen: false }),
}));
