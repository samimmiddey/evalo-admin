'use client';

import { useState, useEffect } from 'react';
import {
   Activity,
   ArrowUpRight,
} from 'lucide-react';
import {
   ResponsiveContainer,
   AreaChart,
   Area,
   XAxis,
   Tooltip,
   CartesianGrid,
} from 'recharts';
import { authData } from '@/data/auth/auth.data';
import PrimaryBody from '@/components/common/primary-body';
import PrimaryTitle from '@/components/common/primary-title';
import SecondaryTitle from '@/components/common/secondary-title';

const AuthBrand = () => {
   const [isMounted, setIsMounted] = useState(false);
   const { brand } = authData;

   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMounted(true);
   }, []);

   return (
      <div className="hidden lg:flex flex-col justify-between p-6 xl:p-8 2xl:p-10 bg-indigo-950/15 border-l border-zinc-900 relative overflow-hidden select-none gap-12">

         {/* Top Visual Console Header (No Corner Text) */}
         <div className="relative z-10 flex items-center justify-between w-full" aria-hidden="true">
            {/* Terminal Window Dots */}
            <div className="flex items-center gap-1.5">
               <span className="h-2.5 w-2.5 rounded-full bg-zinc-800/80 border border-zinc-700/50" />
               <span className="h-2.5 w-2.5 rounded-full bg-zinc-800/80 border border-zinc-700/50" />
               <span className="h-2.5 w-2.5 rounded-full bg-zinc-800/80 border border-zinc-700/50" />
            </div>

            {/* Glowing Center Accent Line */}
            <div className="h-px flex-1 max-w-xs mx-6 bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

            {/* Mini Telemetry Equalizer Bars */}
            <div className="flex items-end gap-1 h-3.5">
               <span className="w-1 h-2 rounded-full bg-violet-500/40" />
               <span className="w-1 h-3.5 rounded-full bg-violet-400" />
               <span className="w-1 h-2.5 rounded-full bg-violet-500/60" />
               <span className="w-1 h-1.5 rounded-full bg-violet-500/30" />
            </div>
         </div>

         {/* Center Showcase Section */}
         <div className="relative z-10 w-full max-w-lg 2xl:max-w-xl mx-auto flex flex-col gap-7">
            {/* Title & Eyebrow */}
            <div className="space-y-3">
               <PrimaryTitle
                  text={
                     (
                        <>
                           {brand.headline.prefix}{' '}
                           <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-100 via-violet-200 to-violet-400">
                              {brand.headline.highlight}
                           </span>
                        </>
                     ) as unknown as string
                  }
                  className="text-2xl! lg:text-3xl! 2xl:text-4xl! leading-[1.2]!"
               />
               <PrimaryBody
                  text={brand.description}
                  className="text-sm! 2xl:text-[15px]! max-w-lg!"
               />
            </div>

            {/* The Telemetry Console Card */}
            <div className="relative rounded-2xl border border-white/10 bg-indigo-950/10 p-5 xl:p-6 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(139,92,246,0.15)] transition-all">
               {/* Card Top Bar */}
               <div className="flex items-center justify-between pb-4 border-b border-zinc-800/70">
                  <div className="flex items-center gap-3">
                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-400">
                        <Activity className="h-4 w-4" />
                     </div>
                     <div>
                        <SecondaryTitle
                           text={brand.card.title}
                           className="text-sm! 2xl:text-base!"
                        />
                        <PrimaryBody
                           text={brand.card.subtitle}
                           className="text-[11px]! 2xl:text-xs!"
                        />
                     </div>
                  </div>

                  <div className="text-right">
                     <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-2xl font-bold font-geist text-zinc-100 tracking-tight">
                           {brand.card.primaryMetric.value}
                        </span>
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
                           <ArrowUpRight className="w-3.5 h-3.5" />
                           {brand.card.primaryMetric.delta}
                        </span>
                     </div>
                     <span className="text-[11px] text-zinc-500 font-mono">
                        {brand.card.primaryMetric.comparison}
                     </span>
                  </div>
               </div>

               {/* Chart Area */}
               <div className="pt-4 h-40 w-full">
                  {isMounted ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                           data={brand.card.chartData}
                           margin={{ top: 10, right: 6, left: 6, bottom: 0 }}
                        >
                           <defs>
                              <linearGradient
                                 id="telemetryCurrentGrad"
                                 x1="0"
                                 y1="0"
                                 x2="0"
                                 y2="1"
                              >
                                 <stop
                                    offset="0%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.32}
                                 />
                                 <stop
                                    offset="95%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.0}
                                 />
                              </linearGradient>
                           </defs>
                           <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="rgba(255, 255, 255, 0.05)"
                           />
                           <XAxis
                              dataKey="time"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#71717a', fontSize: 11 }}
                              dy={6}
                              padding={{ left: 8, right: 8 }}
                           />
                           <Tooltip
                              content={({ active, payload, label }) => {
                                 if (active && payload?.length) {
                                    return (
                                       <div className="rounded-lg border border-zinc-700/80 bg-zinc-950/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md">
                                          <div className="text-[11px] text-zinc-400 font-medium">
                                             {label}
                                          </div>
                                          <div className="mt-1 flex items-center gap-2 font-semibold text-zinc-100 font-geist">
                                             <span className="h-2 w-2 rounded-full bg-violet-400" />
                                             <span>
                                                {payload[0].value?.toLocaleString()} {brand.card.chartUnit}
                                             </span>
                                          </div>
                                          {payload[1] && (
                                             <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-400 font-geist">
                                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                                                <span>
                                                   Baseline: {payload[1].value?.toLocaleString()} {brand.card.chartUnit}
                                                </span>
                                             </div>
                                          )}
                                       </div>
                                    );
                                 }
                                 return null;
                              }}
                           />
                           {/* Baseline comparison dotted line */}
                           <Area
                              type="monotone"
                              dataKey="baseline"
                              stroke="#52525b"
                              strokeWidth={1.5}
                              strokeDasharray="4 4"
                              fill="transparent"
                              activeDot={false}
                           />
                           {/* Active throughput line with glowing fill */}
                           <Area
                              type="monotone"
                              dataKey="current"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#telemetryCurrentGrad)"
                              activeDot={{
                                 r: 4.5,
                                 fill: '#a78bfa',
                                 stroke: '#ffffff',
                                 strokeWidth: 2,
                              }}
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  ) : (
                     <div className="h-full w-full bg-zinc-900/20 rounded animate-pulse" />
                  )}
               </div>

               {/* Metric Badges Grid inside Card */}
               <div className="mt-4 pt-3.5 border-t border-zinc-800/70 grid grid-cols-3 gap-2.5">
                  {brand.card.metrics.map((metric, idx) => (
                     <div
                        key={idx}
                        className="rounded-xl bg-zinc-900/40 p-2.5 border border-zinc-800/50 text-center"
                     >
                        <div className="text-sm font-semibold font-geist text-zinc-100">
                           {metric.value}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                           {metric.label}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Bottom Footer */}
         <div className="flex items-center justify-between text-xs text-zinc-500 pt-6 border-t border-zinc-900">
            <span>{brand.footer.copyright}</span>
            <div className="flex items-center gap-2 text-zinc-500">
               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
               <span>{brand.footer.status}</span>
            </div>
         </div>
      </div>
   );
};

export default AuthBrand;