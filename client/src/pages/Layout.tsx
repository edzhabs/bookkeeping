import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Side/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/Footer";

const Layout = () => {
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
};

export default Layout;
