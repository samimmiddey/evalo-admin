import CardLayout from "@/components/layouts/card-layout";

export const SettingsLoader = () => {
   return (
      <CardLayout className="space-y-6 animate-pulse">
         <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
               <div
                  key={i}
                  className="rounded-xl bg-zinc-950/40 border border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
               >
                  <div className="flex max-sm:flex-col items-start gap-3 max-w-xl">
                     <div className="size-8 rounded-lg bg-zinc-800 shrink-0 mt-0.75" />
                     <div className="space-y-1">
                        <div className="h-4 w-36 rounded bg-zinc-800" />
                        <div className="h-3.5 w-64 sm:w-96 rounded bg-zinc-800/60" />
                     </div>
                  </div>

                  <div className="h-10 2xl:h-11 w-full sm:w-40 2xl:w-45 rounded-lg bg-zinc-800 shrink-0" />
               </div>
            ))}
         </div>

         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="h-4 w-44 rounded bg-zinc-800/60" />
            <div className="h-9 2xl:h-10 w-full sm:w-32 rounded-lg bg-zinc-800" />
         </div>
      </CardLayout>
   );
};

export default SettingsLoader;
