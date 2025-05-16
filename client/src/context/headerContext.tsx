import { NAVTITLE } from "@/constants/side-menu";
import { createContext } from "react";

export interface IHeaderContext {
  headerTitle: string;
  setHeaderTitle: (text: string) => void;
}

export const HeaderContext = createContext<IHeaderContext>({
  headerTitle: NAVTITLE.DASHBOARD.title,
  setHeaderTitle: () => {},
});
