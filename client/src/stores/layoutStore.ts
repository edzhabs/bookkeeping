import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutStore {
  activeNav: string;
  setActiveNav: (key: string) => void;
}

const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      activeNav: "dashboard",
      setActiveNav: (key) => set({ activeNav: key }),
    }),
    {
      name: "layout-storage",
    }
  )
);

export default useLayoutStore;
