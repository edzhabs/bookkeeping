import Footer from "@/components/Footer";
import { AppSidebar } from "@/components/Side/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NAVTITLE } from "@/constants/side-menu";
import { HeaderContext } from "@/context/headerContext";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [headerTitle, setHeaderTitle] = useState(NAVTITLE.DASHBOARD.title);
  return (
    <SidebarProvider>
      <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-2 ">
              <div className="flex flex-col gap-4 py-4 md:px-2 md:gap-6 md:py-6">
                <Outlet />
              </div>
            </div>
            <Footer />
          </div>
        </SidebarInset>
      </HeaderContext.Provider>
    </SidebarProvider>
  );
};

export default Layout;
