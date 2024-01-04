import { create } from "zustand";

interface UploadButtonStore {
  isOPen: boolean;
  onOPen: () => void;
  onClose: () => void;
}

export const useUploadButton = create<UploadButtonStore>()((set) => ({
  isOPen: false,
  onOPen: () => set({ isOPen: true }),
  onClose: () => set({ isOPen: false }),
}));
