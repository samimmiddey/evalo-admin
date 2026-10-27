import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/navigation/dashboard-sidebar";
import DashboardNavbar from "@/components/navigation/dashboard-navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
   return (
      <SidebarProvider>
         <DashboardSidebar />
         <main className="flex flex-col flex-1 w-full min-w-0 min-h-screen">
            <DashboardNavbar />
            <div className="flex-1 w-full sm:px-4">
               {children}
            </div>
         </main>
      </SidebarProvider>
   );
}