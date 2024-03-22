import { create } from "zustand";

interface ActionDialogStore {
  isOPen: boolean;
  file: { id: string; name: string } | undefined;
  onOPen: (file: { id: string; name: string }) => void;
  onClose: () => void;
}

export const useActionDialog = create<ActionDialogStore>()((set) => ({
  isOPen: false,
  file: undefined,
  onOPen: (file: { id: string; name: string }) => set({ isOPen: true, file }),
  onClose: () => set({ isOPen: false, file: undefined }),
}));
