import CardLayout from "@/components/layouts/card-layout";

export const LineChartLoader = () => {
   return (
      <CardLayout className="p-5! 2xl:p-6! border-white/5! animate-pulse">
         {/* Title skeleton */}
         <div className="h-5 w-44 rounded bg-zinc-800 mb-5 2xl:mb-6" />

         {/* Chart body skeleton */}
         <div className="h-62.5 sm:h-75 2xl:h-85 flex flex-col justify-between pt-2">
            <div className="flex-1 flex gap-3">
               {/* Y-axis tick placeholders */}
               <div className="flex flex-col justify-between pb-6 shrink-0">
                  <div className="h-2.5 w-6 rounded bg-zinc-800/40" />
                  <div className="h-2.5 w-6 rounded bg-zinc-800/40" />
                  <div className="h-2.5 w-6 rounded bg-zinc-800/40" />
                  <div className="h-2.5 w-6 rounded bg-zinc-800/40" />
               </div>

               {/* Grid lines and smooth chart wave */}
               <div className="relative flex-1 flex flex-col justify-between pb-6">
                  <div className="h-px w-full border-t border-dashed border-white/5" />
                  <div className="h-px w-full border-t border-dashed border-white/5" />
                  <div className="h-px w-full border-t border-dashed border-white/5" />
                  <div className="h-px w-full border-t border-dashed border-white/5" />

                  {/* Smooth trendline with gradient area */}
                  <svg
                     className="absolute inset-0 size-full overflow-hidden pb-6"
                     preserveAspectRatio="none"
                     viewBox="0 0 1000 300"
                  >
                     <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.35" />
                           <stop offset="100%" stopColor="#27272a" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     <path
                        d="M0,210 C160,210 240,110 380,150 C520,190 600,60 740,90 C850,115 920,40 1000,60 L1000,300 L0,300 Z"
                        fill="url(#trendGradient)"
                     />
                     <path
                        d="M0,210 C160,210 240,110 380,150 C520,190 600,60 740,90 C850,115 920,40 1000,60"
                        fill="none"
                        stroke="#52525b"
                        strokeOpacity="0.5"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                     />
                  </svg>
               </div>
            </div>

            {/* X-axis date tick placeholders */}
            <div className="flex items-center justify-between pl-9 pr-2 pt-2">
               {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-2.5 w-10 rounded bg-zinc-800/40" />
               ))}
            </div>
         </div>
      </CardLayout>
   );
};

export const InterviewTrendsLoader = LineChartLoader;
export default LineChartLoader;
