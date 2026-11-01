"use client";

import useMediaQuery from '@/hooks/use-media-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export interface LineSeriesConfig {
   dataKey: string;
   name?: string;
   color: string;
   strokeWidth?: number;
   strokeDasharray?: string;
}

interface CustomLineChartProps<T extends object> {
   data: T[];
   series?: LineSeriesConfig[];
   dataKey?: string;
   lineColor?: string;
   metricLabel?: string;
   xAxisKey?: string;
   formatLabel?: (val: string) => string;
   labelAngle?: number;
   xAxisHeight?: number;
   xAxisInterval?: number | "preserveStart" | "preserveEnd" | "preserveStartEnd";
   showYAxis?: boolean;
   showGrid?: boolean;
   showDots?: boolean;
   curveType?: "monotone" | "linear" | "natural" | "step";
}

const CustomLineChart = <T extends object>(
   {
      data,
      series,
      dataKey = 'count',
      lineColor = '#8b5cf6',
      metricLabel,
      xAxisKey = 'date',
      formatLabel,
      labelAngle,
      xAxisHeight,
      xAxisInterval = 'preserveStartEnd',
      showYAxis = true,
      showGrid = true,
      showDots = false,
      curveType = 'monotone'
   }: CustomLineChartProps<T>
) => {
   const smWidth = useMediaQuery(640);

   const activeSeries: LineSeriesConfig[] =
      series && series.length > 0
         ? series
         : [{ dataKey, name: metricLabel ?? 'Value', color: lineColor }];

   return (
      <div className="size-full [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-line]:outline-none [&_path]:outline-none [&_svg]:outline-none min-h-0">
         <LineChart
            style={{
               width: '100%',
               height: '100%',
               maxWidth: '100%',
               maxHeight: '100%',
            }}
            responsive
            data={data}
            margin={{
               top: 5,
               right: 5,
               left: 0,
               bottom: 5,
            }}
         >
            {showGrid && (
               <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeDasharray="3 3"
                  vertical={false}
               />
            )}
            <XAxis
               dataKey={xAxisKey}
               axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
               tickLine={false}
               tick={{ fill: "#a1a1aa", fontSize: 11 }}
               interval={xAxisInterval}
               angle={labelAngle ?? 0}
               textAnchor={labelAngle ? "end" : "middle"}
               height={xAxisHeight}
               tickFormatter={(val: string) => formatLabel ? formatLabel(val) : val}
            />
            {showYAxis && !smWidth && (
               <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  width={30}
                  allowDecimals={false}
               />
            )}
            <Tooltip
               content={<CustomTooltip formatLabel={formatLabel} />}
               cursor={{ stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1, strokeDasharray: "4 4" }}
               wrapperStyle={{ outline: "none" }}
            />
            {activeSeries.map((s) => (
               <Line
                  key={s.dataKey}
                  type={curveType}
                  dataKey={s.dataKey}
                  name={s.name ?? s.dataKey}
                  stroke={s.color}
                  strokeWidth={s.strokeWidth ?? 2}
                  strokeDasharray={s.strokeDasharray}
                  dot={
                     showDots
                        ? { r: 3, fill: s.color, stroke: "#18181b", strokeWidth: 1.5 }
                        : false
                  }
                  activeDot={{
                     r: 5,
                     fill: s.color,
                     stroke: "#18181b",
                     strokeWidth: 2,
                  }}
               />
            ))}
         </LineChart>
      </div>
   );
};

export default CustomLineChart;

interface CustomTooltipProps {
   active?: boolean;
   payload?: {
      value?: number;
      name?: string;
      color?: string;
      dataKey?: string;
      payload?: Record<string, unknown>;
   }[];
   label?: string | number;
   formatLabel?: (val: string) => string;
}

const CustomTooltip = ({
   active,
   payload,
   label,
   formatLabel,
}: CustomTooltipProps) => {
   if (!active || !payload?.length) return null;

   const rawLabel = typeof label === "string" || typeof label === "number" ? String(label) : "Date";
   const displayLabel = formatLabel ? formatLabel(rawLabel) : rawLabel;

   return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-36">
         {/* Top row: formatted date / category label */}
         <span className="text-[11px] font-semibold text-zinc-300">{displayLabel}</span>

         {/* Subtle divider */}
         <div className="my-1.5 h-px bg-white/5" />

         {/* Series rows: color dot, metric name, and value */}
         <div className="flex flex-col gap-1.5">
            {payload.map((item, index) => {
               const color = item.color ?? "#8b5cf6";
               const name = item.name ?? item.dataKey ?? "Value";
               const count = typeof item.value === "number" ? item.value : 0;

               return (
                  <div key={index} className="flex items-center justify-between gap-4 text-[11px]">
                     <div className="flex items-center gap-2">
                        <span
                           className="size-2 rounded-full shrink-0 shadow-xs"
                           style={{ backgroundColor: color }}
                        />
                        <span className="text-zinc-400 capitalize">{name}</span>
                     </div>
                     <span className="font-semibold text-zinc-200">{count}</span>
                  </div>
               );
            })}
         </div>
      </div>
   );
};