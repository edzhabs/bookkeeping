import { useMatch } from "react-router-dom";

export function useIsSidebarActive(path: string) {
  return Boolean(
    useMatch({ path: `${path.toLocaleLowerCase()}/*`, end: false })
  );
}
