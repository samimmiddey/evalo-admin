"use client";

import useMediaQuery from '@/hooks/use-media-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const COLORS = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#06b6d4"];

interface CustomBarChartProps<T extends object> {
   data: T[];
   formatLabel?: (val: string) => string;
   labelAngle?: number;
   dataKey?: string;
   xAxisKey?: string;
   maxBarSize?: number;
   xAxisHeight?: number;
   showYAxis?: boolean;
   showGrid?: boolean;
   metricLabel?: string;
}

const CustomBarChart = <T extends object>(
   {
      data,
      formatLabel,
      labelAngle,
      dataKey = 'count',
      xAxisKey = 'label',
      maxBarSize,
      xAxisHeight,
      showYAxis = true,
      showGrid = true,
      metricLabel
   }: CustomBarChartProps<T>
) => {
   const smWidth = useMediaQuery(640);

   return (
      <div className="size-full [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-bar-rectangle]:outline-none [&_path]:outline-none [&_svg]:outline-none min-h-0">
         <BarChart
            style={{
               width: '100%',
               height: '100%',
               maxWidth: '100%',
               maxHeight: '100%',
               aspectRatio: 1.618
            }}
            responsive
            data={data}
            margin={{
               top: 5,
               right: 0,
               left: 0,
               bottom: 5,
            }}
         >
            {
               showGrid &&
               <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeDasharray="3 3"
                  vertical={false}
               />
            }
            <XAxis
               dataKey={xAxisKey}
               axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
               tickLine={false}
               tick={{ fill: "#a1a1aa", fontSize: 11 }}
               interval={0}
               angle={labelAngle ?? 0}
               textAnchor="end"
               height={xAxisHeight}
               tickFormatter={(val: string) => formatLabel ? formatLabel(val) : val}
            />
            {
               showYAxis && !smWidth &&
               <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  width={30}
               />
            }
            <Tooltip
               content={
                  <CustomTooltip
                     metricLabel={metricLabel}
                     dataKey={dataKey}
                     xAxisKey={xAxisKey}
                  />
               }
               cursor={false}
               wrapperStyle={{ outline: "none" }}
            />
            <Bar dataKey={dataKey} maxBarSize={maxBarSize} radius={[6, 6, 0, 0]} minPointSize={3}>
               {data.map((_, index) => (
                  <Cell
                     key={index}
                     fill={COLORS[index % COLORS.length]}
                     style={{ outline: "none" }}
                  />
               ))}
            </Bar>
         </BarChart>
      </div>
   );
};

export default CustomBarChart;

interface CustomTooltipProps {
   active?: boolean;
   payload?: {
      value?: number;
      payload?: Record<string, unknown>;
      color?: string;
   }[];
   metricLabel?: string;
   dataKey?: string;
   xAxisKey?: string;
}

const CustomTooltip = ({
   active,
   payload,
   metricLabel = "Interviews",
   dataKey = "count",
   xAxisKey = "label"
}: CustomTooltipProps) => {
   if (!active || !payload?.length) return null;

   const item = payload[0];
   const dataObj = item.payload;

   const rawLabel = dataObj?.[xAxisKey];
   const label = typeof rawLabel === "string" || typeof rawLabel === "number" ? String(rawLabel) : "Item";

   const rawCount = item.value ?? dataObj?.[dataKey];
   const count = typeof rawCount === "number" ? rawCount : 0;

   const percentage = typeof dataObj?.percentage === "number" ? dataObj.percentage : undefined;
   const color = item.color ?? "#8b5cf6";

   return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2.5 shadow-2xl backdrop-blur-md">
         {/* Top row: color dot, domain title & percentage pill */}
         <div className="flex items-center gap-2">
            <span
               className="size-2 rounded-full shrink-0 shadow-xs"
               style={{ backgroundColor: color }}
            />
            <span className="text-[11px] font-semibold text-zinc-100">{label}</span>
            {percentage !== undefined && (
               <span className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
                  {percentage}%
               </span>
            )}
         </div>

         {/* Bottom row: metric name and count value */}
         <div className="mt-1.5 flex items-center justify-between gap-5 text-[11px] text-zinc-400">
            <span>{metricLabel}</span>
            <span className="font-semibold text-zinc-200">{count}</span>
         </div>
      </div>
   );
};
