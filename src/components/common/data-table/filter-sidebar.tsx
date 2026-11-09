"use client";

import { Button } from "@/components/ui/button";
import {
   Drawer,
   DrawerContent,
   DrawerFooter,
   DrawerHeader,
} from "@/components/ui/drawer";
import SecondaryTitle from "../secondary-title";
import PrimaryBody from "../primary-body";
import DateRangePicker from "../date-range-picker";
import { Label } from "@/components/ui/label";
import { FilterItem } from "./data-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useMediaQuery from "@/hooks/use-media-query";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";

interface FilterSidebarProps {
   open: boolean;
   setOpen: () => void;
   items?: FilterItem[];
   onResetFilters?: () => void;
}

export function FilterSidebar({ open, setOpen, items, onResetFilters }: FilterSidebarProps) {
   const [draftValues, setDraftValues] = useState<Record<string, unknown>>({});

   const mdWidth = useMediaQuery(768);

   // Sync draft with parent props whenever drawer opens
   useEffect(() => {
      if (open && items) {
         const initial: Record<string, unknown> = {};

         items.forEach(item => {
            initial[item.id] = item.value;
         });

         setDraftValues(initial);
      }
   }, [open, items]);

   // Apply change
   const handleApply = () => {
      items?.forEach(item => {
         if (item.type === 'date') {
            item.setValue(draftValues[item.id] as DateRange | undefined);
         } else if (item.type === 'select') {
            item.setValue((draftValues[item.id] as string) ?? null);
         }
      });

      setOpen();
   };

   // Clear button
   const handleClear = () => {
      if (onResetFilters) {
         onResetFilters();
      }

      setDraftValues({});
   };

   const hasActiveDraft = Object.values(draftValues).some((val) => {
      if (!val) return false;
      if (typeof val === 'object' && 'from' in (val as Record<string, unknown>)) {
         return Boolean((val as DateRange).from && (val as DateRange).to);
      }
      return true;
   });

   return (
      <Drawer
         open={open}
         onOpenChange={setOpen}
         showSwipeHandle={Boolean(mdWidth)}
         swipeDirection={mdWidth ? "down" : "right"}
      >
         <DrawerContent className={`border-white/5 bg-zinc-900 ${mdWidth ? 'h-150' : ''}`}>
            <DrawerHeader>
               <div className="flex items-start gap-4 justify-between">
                  <div className="flex flex-col gap-1 w-full">
                     <SecondaryTitle
                        text='Filters'
                        className='text-base 2xl:text-lg font-medium'
                     />
                     <PrimaryBody
                        text='Apply filters to refine your search results'
                        className='text-[13px] 2xl:text-sm'
                     />
                  </div>
                  {
                     !mdWidth &&
                     <div
                        className="size-6 rounded-md bg-zinc-800 flex items-center justify-center shrink-0 cursor-pointer"
                        onClick={setOpen}
                     >
                        <X className="h-4 w-4 text-zinc-300" />
                     </div>
                  }
               </div>
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-6 my-4">
               {
                  items?.map(item => {
                     if (item.type === 'date') {
                        return (
                           <div key={item.id}>
                              <Label className="text-[13px] 2xl:text-sm font-medium text-zinc-300 mb-2">
                                 {item.label}
                              </Label>
                              <DateRangePicker
                                 date={draftValues[item.id] as DateRange | undefined}
                                 setDate={val => setDraftValues(prev => ({
                                    ...prev, [item.id]: val
                                 }))}
                              />
                           </div>
                        );
                     }

                     if (item.type === 'select') {
                        const currentValue = (draftValues[item.id] as string | undefined) ?? 'NONE';

                        return (
                           <div key={item.id}>
                              <Label className="text-[13px] 2xl:text-sm font-medium text-zinc-300 mb-2">
                                 {item.label}
                              </Label>
                              <Select
                                 value={currentValue}
                                 onValueChange={val => setDraftValues(prev => ({
                                    ...prev,
                                    [item.id]: val === 'NONE' ? undefined : val
                                 }))}
                              >
                                 <SelectTrigger className="w-full h-10! border-white/10">
                                    <SelectValue placeholder="None">
                                       {(val) => item.options.find((opt) => opt.value === val)?.label}
                                    </SelectValue>
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       {
                                          item.options.map((opt) => (
                                             <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                                className='h-10!'
                                             >
                                                {opt.label}
                                             </SelectItem>
                                          ))
                                       }
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           </div>

                        );
                     }
                  })
               }
            </div>
            <DrawerFooter className='flex flex-row items-center gap-2.5'>
               <Button
                  size='xl'
                  variant='ghost'
                  onClick={handleClear}
                  disabled={!Boolean(hasActiveDraft)}
                  className='bg-red-500/10! text-red-400! w-1/2'
               >
                  clear
               </Button>
               <Button
                  size="xl"
                  onClick={handleApply}
                  className='w-1/2'
                  disabled={!Boolean(hasActiveDraft)}
               >
                  Apply Filters
               </Button>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
