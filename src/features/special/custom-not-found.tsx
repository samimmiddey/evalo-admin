"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";
import { useRouter } from "next/navigation";

const CustomNotFound = () => {
   const router = useRouter();

   return (
      <div className="px-6 relative flex min-h-[85vh] items-center justify-center overflow-hidden py-12">
         {/* Huge Background 404 */}
         <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
            <motion.h1
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 0.04, y: 0 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="text-[35vw] font-black leading-none tracking-tighter"
            >
               404
            </motion.h1>
         </div>

         {/* Ambient Glow */}
         <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <motion.div
               animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
               }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="h-[40vh] w-[40vh] rounded-full bg-primary/30 blur-[100px] md:h-[60vh] md:w-[60vh]"
            />
         </div>

         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-auto flex w-full max-w-162.5 flex-col items-center justify-center text-center 2xl:max-w-200"
         >
            <div className="relative mb-10 flex items-center justify-center">
               <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                     type: "spring",
                     stiffness: 200,
                     damping: 15,
                     delay: 0.1,
                  }}
                  className="relative z-10 flex size-24 items-center justify-center rounded-3xl border border-primary/20 bg-background/60 shadow-2xl backdrop-blur-xl 2xl:size-32"
               >
                  <Map className="size-10 text-primary 2xl:size-14" />
               </motion.div>
               {/* Animated Ripple Effects */}
               <style>{`
                  @keyframes custom-ping {
                     75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                     }
                  }
               `}</style>
               <div className="absolute inset-0 rounded-3xl border-2 border-primary/40 animate-[custom-ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
               <div className="absolute inset-0 rounded-3xl border-2 border-primary/40 animate-[custom-ping_3s_cubic-bezier(0,0,0.2,1)_1.5s_infinite]" />
            </div>

            <div className="mb-10 flex flex-col gap-4 2xl:gap-6">
               <PrimaryTitle text="Looks like you're lost" />
               <PrimaryBody text="The page you are looking for is missing in action. It might have been moved, deleted, or you may have mistyped the address." />
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
               <Button
                  size="lg"
                  variant='white'
                  className="group relative w-full px-8 sm:w-auto"
               >
                  <Link href="/dashboard" className="flex items-center gap-2">
                     <Home className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                     <span className="font-medium">Back to Dashboard</span>
                  </Link>
               </Button>
               <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-8 sm:w-auto"
                  onClick={() => router.back()}
               >
                  Go Back
               </Button>
            </div>
         </motion.div>
      </div>
   );
};

export default CustomNotFound;