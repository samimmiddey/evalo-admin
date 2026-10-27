"use client";

import { motion } from "motion/react";
import { AlertOctagon, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrimaryTitle from "@/components/common/primary-title";
import PrimaryBody from "@/components/common/primary-body";

const CustomError = ({
   error,
   reset,
}: {
   error: Error & { digest?: string; };
   reset: () => void;
}) => {
   return (
      <div className="px-6 relative flex min-h-[85vh] items-center justify-center overflow-hidden py-12">
         {/* Huge Background Error Text */}
         <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
            <motion.h1
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 0.04, y: 0 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="text-[25vw] font-black leading-none tracking-tighter text-destructive"
            >
               ERROR
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
               className="h-[40vh] w-[40vh] rounded-full bg-destructive/30 blur-[100px] md:h-[60vh] md:w-[60vh]"
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
                  className="relative z-10 flex size-24 items-center justify-center rounded-3xl border border-destructive/20 bg-background/60 shadow-2xl backdrop-blur-xl 2xl:size-32"
               >
                  <AlertOctagon className="size-10 text-destructive 2xl:size-14" />
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
               <div className="absolute inset-0 rounded-3xl border-2 border-destructive/40 animate-[custom-ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
               <div className="absolute inset-0 rounded-3xl border-2 border-destructive/40 animate-[custom-ping_3s_cubic-bezier(0,0,0.2,1)_1.5s_infinite]" />
            </div>

            <div className="mb-10 flex flex-col gap-4 2xl:gap-6">
               <PrimaryTitle text="Oops! Something went wrong" />
               <PrimaryBody
                  text={process.env.NODE_ENV === 'development' ? error.message : "We encountered an unexpected error while processing your request. Please try again."}
               />
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
               <Button
                  onClick={() => reset()}
                  size="lg"
                  variant='white'
                  className="group relative px-8 w-full sm:w-auto"
               >
                  <RotateCw className="size-4 transition-transform duration-500 group-hover:rotate-180" />
                  <span className="font-medium">Try Again</span>
               </Button>
               <Button
                  variant="outline"
                  size="lg"
                  className="group px-8 w-full sm:w-auto"
                  onClick={() => window.location.href = '/dashboard'}
               >
                  <Home className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span className="font-medium">Go to Dashboard</span>
               </Button>
            </div>
         </motion.div>
      </div>
   );
};

export default CustomError;