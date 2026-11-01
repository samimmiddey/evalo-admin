import CardLayout from "@/components/layouts/card-layout";

export const LineChartLoader = () => {
   return (
      <CardLayout className="p-5! 2xl:p-6! border-white/5! animate-pulse">
         {/* Title skeleton */}
         <div className="h-5 w-44 rounded bg-zinc-800 mb-5 2xl:mb-6" />

         {/* Chart body skeleton */}
         <div className="h-62.5 sm:h-75 2xl:h-85 flex flex-col justify-between pt-6 pb-2">
            {/* Grid lines & wave skeleton */}
            <div className="relative flex-1 flex flex-col justify-between">
               <div className="h-px w-full border-t border-dashed border-white/5" />
               <div className="h-px w-full border-t border-dashed border-white/5" />
               <div className="h-px w-full border-t border-dashed border-white/5" />
               <div className="h-px w-full border-t border-dashed border-white/5" />

               {/* Simulated trendlines */}
               <svg
                  className="absolute inset-0 size-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 50"
               >
                  <path
                     d="M0,38 Q25,12 50,28 T80,8 T100,18"
                     fill="none"
                     stroke="rgba(255, 255, 255, 0.08)"
                     strokeWidth="2"
                  />
                  <path
                     d="M0,45 Q20,32 45,40 T75,22 T100,28"
                     fill="none"
                     stroke="rgba(255, 255, 255, 0.05)"
                     strokeWidth="2"
                     strokeDasharray="4 4"
                  />
               </svg>
            </div>

            {/* X-axis date tick placeholders */}
            <div className="flex items-center justify-between pt-4">
               {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-2.5 w-9 rounded bg-zinc-800/50" />
               ))}
            </div>
         </div>
      </CardLayout>
   );
};

export const InterviewTrendsLoader = LineChartLoader;
export default LineChartLoader;

