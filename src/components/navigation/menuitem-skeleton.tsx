import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuItem,
} from "@/components/ui/sidebar";

const SKELETON_WIDTHS = ["w-24", "w-32", "w-28", "w-24", "w-28"];

const MenuItemSkeleton = () => {
   return (
      <SidebarGroup className="px-2 py-0">
         <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-1">
            Navigation
         </SidebarGroupLabel>
         <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
               {SKELETON_WIDTHS.map((widthClass, index) => (
                  <SidebarMenuItem key={index}>
                     <div className="flex h-9 items-center gap-3 rounded-lg px-3 bg-white/3 border border-transparent">
                        <div className="size-4 rounded bg-zinc-800 animate-pulse shrink-0" />
                        <div className={`h-3.5 ${widthClass} rounded bg-zinc-800 animate-pulse`} />
                     </div>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
};

export default MenuItemSkeleton;
