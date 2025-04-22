import Footer from "@/components/Footer";
import OutletComp from "@/components/Outlet";
import { AppSidebar } from "@/components/Side/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2 ">
            <div className="flex flex-col gap-4 py-4 md:px-2 md:gap-6 md:py-6">
              <OutletComp />
            </div>
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
