import { create } from "zustand";

interface LayoutStore {
  activeNav: string;
  setActiveNav: (key: string) => void;
}

const useLayoutStore = create<LayoutStore>((set) => ({
  activeNav: "dashboard",
  setActiveNav: (key) => set({ activeNav: key }),
}));

export default useLayoutStore;
