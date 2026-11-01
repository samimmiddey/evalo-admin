import CardLayout from "@/components/layouts/card-layout";

const BAR_HEIGHTS = [45, 75, 30, 90, 60, 40, 80, 50, 65, 35, 70];

export const BarChartLoader = () => {
   return (
      <CardLayout className="p-5! 2xl:p-6! border-white/5! animate-pulse">
         {/* Title skeleton */}
         <div className="h-5 w-56 rounded bg-zinc-800 mb-5 2xl:mb-6" />

         {/* Chart bars skeleton */}
         <div className="h-62.5 sm:h-75 2xl:h-85 flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-2">
            {BAR_HEIGHTS.map((height, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                     className="w-full rounded-t-md bg-zinc-800/80"
                     style={{ height: `${height}%` }}
                  />
                  <div className="h-2.5 w-3/4 rounded bg-zinc-800/50" />
               </div>
            ))}
         </div>
      </CardLayout>
   );
};

export default BarChartLoader;

