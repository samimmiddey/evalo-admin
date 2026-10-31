import CardLayout from "@/components/layouts/card-layout";

export const DashboardMetricsLoader = () => {
   return (
      <div className="grid xs:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-5">
         {Array.from({ length: 4 }).map((_, i) => (
            <CardLayout
               key={i}
               className="p-5! space-y-4 border-white/5!"
            >
               <div className="flex justify-between gap-3 xs:gap-2">
                  <div className="h-5 w-24 rounded bg-zinc-800" />
                  <div className="size-9 rounded-lg bg-zinc-800 shrink-0" />
               </div>
               <div className="h-7 w-16 rounded-md bg-zinc-800" />
               <div className="h-3 w-28 rounded bg-zinc-800/60" />
            </CardLayout>
         ))}
      </div>
   );
};

export default DashboardMetricsLoader;
