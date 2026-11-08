"use client";

import { format, isThisYear } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DATE_PRESETS } from "@/data/global/global.data";
import useMediaQuery from "@/hooks/use-media-query";

interface DatePickerProps {
   date: DateRange | undefined;
   setDate: (date: DateRange | undefined) => void;
   className?: string;
}

const checkIsThisYear = (date: Date) => {
   return isThisYear(date) ? format(date, 'LLL dd') : format(date, 'LLL dd, y');
};

const DateRangePicker = ({
   date,
   setDate,
   className
}: DatePickerProps) => {
   const [activePreset, setActivePreset] = useState<string | null>(
      date === undefined ? "All Time" : "This Month"
   );
   const [month, setMonth] = useState<Date | undefined>(date?.from || new Date());

   const handlePresetClick = (preset: (typeof DATE_PRESETS)[number]) => {
      setActivePreset(preset.label);
      const newRange = preset.getRange();
      setDate(newRange);

      if (newRange?.from) {
         setMonth(newRange.from);
      }
   };

   const handleCalendarSelect = (newDate: DateRange | undefined) => {
      setActivePreset("Custom");
      setDate(newDate);
   };

   const getDisplayLabel = () => {
      if (!date?.from) return "All Time";
      const label = activePreset || "Custom";
      const dateRangeStr = date.to
         ? `${checkIsThisYear(date.from)} - ${checkIsThisYear(date.to)}`
         : checkIsThisYear(date.from);

      return `${dateRangeStr} | ${label}`;
   };

   const mdWidth = useMediaQuery(768);

   return (
      <Field className={cn("w-auto", className)}>
         <Popover>
            <PopoverTrigger
               render={
                  <Button
                     variant="outline"
                     id="date-picker-range"
                     className="justify-start items-center! px-2.5 font-normal h-10 gap-2 cursor-pointer text-zinc-300! border-white/10!"
                  >
                     <CalendarIcon className="size-4 shrink-0" data-icon="inline-start" />
                     <span className="truncate text-[13px]! mt-px">
                        {getDisplayLabel()}
                     </span>
                  </Button>
               }
            />
            <PopoverContent
               side="bottom"
               className={cn(
                  "w-[calc(100vw-2rem)] sm:w-auto p-0",
                  mdWidth && "max-h-(--available-height) overflow-y-auto overscroll-contain"
               )}
               align="end"
               collisionAvoidance={{ side: 'none' }}
            >
               <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">

                  {/* Presets Sidebar */}
                  <div className="p-2 flex flex-col gap-1 w-full sm:w-36">
                     {DATE_PRESETS.map((preset) => {
                        const isSelected = activePreset === preset.label;
                        return (
                           <Button
                              key={preset.label}
                              variant={isSelected ? "secondary" : "ghost"}
                              size="sm"
                              className={cn(
                                 "justify-start text-xs font-normal h-8 cursor-pointer",
                                 isSelected && "font-medium"
                              )}
                              onClick={() => handlePresetClick(preset)}
                           >
                              {preset.label}
                           </Button>
                        );
                     })}
                  </div>

                  {/* Calendar */}
                  <div className="p-2 flex-1 w-full">
                     <Calendar
                        resetOnSelect
                        mode="range"
                        month={month}
                        onMonthChange={setMonth}
                        selected={date}
                        onSelect={handleCalendarSelect}
                        numberOfMonths={mdWidth ? 1 : 2}
                        className="w-full"
                     />
                  </div>

               </div>
            </PopoverContent>
         </Popover>
      </Field>
   );
};

export default DateRangePicker;
