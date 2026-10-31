"use client";

import { DashboardSidebarMenu } from "@/components/navigation/sidebar-menu";
import {
   Sidebar,
   SidebarContent,
   SidebarHeader,
   useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/components/common/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { navigationData } from "@/data/navigation/navigation.data";

const DashboardSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
   const { setOpenMobile } = useSidebar();

   return (
      <Sidebar
         {...props}
         collapsible="offcanvas"
         className="border-r border-white/5 **:data-[sidebar=sidebar]:bg-zinc-900/40"
      >
         {/* Sidebar Header: Aligned height with DashboardNavbar */}
         <SidebarHeader className="h-14 px-4 border-b border-white/5 flex flex-row items-center justify-between">
            <Link href="/dashboard" className="hover:opacity-90 transition-opacity">
               <Logo />
            </Link>
            <Button
               variant="ghost"
               size="icon-sm"
               className="lg:hidden cursor-pointer size-8 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all duration-200"
               onClick={() => setOpenMobile(false)}
               aria-label="Close mobile sidebar"
            >
               <ChevronLeft className="size-5" />
            </Button>
         </SidebarHeader>

         {/* Sidebar Content */}
         <SidebarContent className="py-4">
            <DashboardSidebarMenu items={navigationData} />
         </SidebarContent>
      </Sidebar>
   );
};

export default DashboardSidebar;
