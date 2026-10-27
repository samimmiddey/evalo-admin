"use client";

import { Show, UserButton, useUser } from '@clerk/nextjs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { userButtonAppearance, userProfileAppearance } from '@/constants/clerk-appearance';

const DashboardNavbar = () => {
   const { isLoaded } = useUser();

   return (
      <header className='sticky top-0 z-30 w-full h-14 border-b border-white/5 bg-zinc-900/40 backdrop-blur-xl transition-all'>
         <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Sidebar trigger */}
            <SidebarTrigger className="cursor-pointer size-8 rounded-lg bg-white/5 text-violet-400 transition-colors" />


            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-3">
               {!isLoaded ? (
                  <div className="size-8 rounded-full bg-zinc-800 animate-pulse ring-2 ring-white/5" />
               ) : (
                  <Show when="signed-in">
                     <div className="flex items-center gap-3">
                        <UserButton
                           appearance={userButtonAppearance}
                           userProfileProps={{
                              appearance: userProfileAppearance,
                           }}
                        />
                     </div>
                  </Show>
               )}
            </div>
         </div>
      </header>
   );
};

export default DashboardNavbar;