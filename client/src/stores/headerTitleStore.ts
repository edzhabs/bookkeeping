import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HeaderStore {
  headerTitle: string;
  setHeaderTitle: (text: string) => void;
}

const useHeaderStore = create<HeaderStore>()(
  persist(
    (set) => ({
      headerTitle: "dashboard",
      setHeaderTitle: (text) => set({ headerTitle: text }),
    }),
    {
      name: "headerTitle-storage",
    }
  )
);

export default useHeaderStore;
