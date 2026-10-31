"use client";

import { LucideIcon } from "lucide-react";
import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationItem {
   name: string;
   href: string;
   icon?: LucideIcon;
}

interface DashboardSidebarMenuProps {
   items: NavigationItem[];
}

export function DashboardSidebarMenu({ items }: DashboardSidebarMenuProps) {
   const pathname = usePathname();
   const { isMobile, setOpenMobile } = useSidebar();

   return (
      <SidebarGroup className="px-2 py-0">
         <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-1">
            Navigation
         </SidebarGroupLabel>
         <SidebarGroupContent>
            <SidebarMenu className="gap-2">
               {items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                     <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                           tooltip={item.name}
                           isActive={isActive}
                           className={cn(
                              "h-10 px-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group",
                              isActive
                                 ? "relative bg-violet-500/15! bg-linear-to-r! from-violet-500/30! via-violet-500/15! to-transparent! text-violet-200! before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.75 before:-translate-y-1/2 before:rounded-r-full before:bg-violet-400"
                                 : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                           )}
                        >
                           <Link
                              href={item.href}
                              onClick={() => {
                                 if (isMobile) setOpenMobile(false);
                              }}
                              className="flex items-center gap-3 w-full"
                           >
                              {Icon && (
                                 <Icon
                                    className={cn(
                                       "size-4 shrink-0 transition-colors",
                                       isActive ? "text-violet-300" : "text-zinc-400 group-hover/menu-button:text-zinc-300"
                                    )}
                                 />
                              )}
                              <span className="truncate">{item.name}</span>
                           </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  );
               })}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
}
