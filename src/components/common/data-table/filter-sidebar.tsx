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
import { Date, Role, Status } from "./data-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useMediaQuery from "@/hooks/use-media-query";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { UserRole, UserStatus } from "@/generated/prisma/enums";
import { X } from "lucide-react";

interface FilterSidebarProps {
   open: boolean;
   setOpen: () => void;
   date?: Date;
   role?: Role;
   status?: Status;
   onResetFilters?: () => void;
}

export function FilterSidebar({ open, setOpen, date, role, status, onResetFilters }: FilterSidebarProps) {
   const [draftDate, setDraftDate] = useState<DateRange | undefined>(date?.value);
   const [draftRole, setDraftRole] = useState<UserRole | undefined>(role?.value);
   const [draftStatus, setDraftStatus] = useState<UserStatus | undefined>(status?.value);

   const mdWidth = useMediaQuery(768);

   // Sync draft with parent props whenever drawer opens
   useEffect(() => {
      if (open) {
         setDraftDate(date?.value);
         setDraftRole(role?.value);
         setDraftStatus(status?.value);
      }
   }, [open, date?.value, role?.value, status?.value]);

   // Handle date change
   const handleDateChange = (val: DateRange | undefined) => {
      setDraftDate(val);
   };

   // Handle role change
   const handleRoleChange = (val: UserRole | null) => {
      setDraftRole(val ?? undefined);
   };

   // Handle status change
   const handleStatusChange = (val: UserStatus | null) => {
      setDraftStatus(val ?? undefined);
   };

   // Apply button
   const handleApply = () => {
      date?.setValue(draftDate);
      role?.setValue(draftRole ?? null);
      status?.setValue(draftStatus ?? null);
      setOpen();
   };

   // Clear button
   const handleClear = () => {
      if (onResetFilters) {
         onResetFilters();
      }

      setDraftDate(undefined);
      setDraftRole(undefined);
      setDraftStatus(undefined);
   };

   return (
      <Drawer
         open={open}
         onOpenChange={setOpen}
         showSwipeHandle={Boolean(mdWidth)}
         swipeDirection={mdWidth ? "down" : "right"}
      >
         <DrawerContent className='border-white/5 bg-zinc-900'>
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
                  date &&
                  <div>
                     <Label className="text-[13px] 2xl:text-sm font-medium text-zinc-300 mb-2">
                        {date.label}
                     </Label>
                     <DateRangePicker
                        date={draftDate}
                        setDate={handleDateChange}
                     />
                  </div>
               }
               {
                  role &&
                  <div>
                     <Label className="text-[13px] 2xl:text-sm font-medium text-zinc-300 mb-2">
                        {role.label}
                     </Label>
                     <Select
                        value={draftRole ?? 'NONE'}
                        onValueChange={(value) => handleRoleChange(value as UserRole)}
                     >
                        <SelectTrigger className="w-full h-10! border-white/10">
                           <SelectValue placeholder="None">
                              {(val) => role.options.find((opt) => opt.value === val)?.label}
                           </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              {
                                 role.options.map((item) => (
                                    <SelectItem
                                       key={item.value}
                                       value={item.value}
                                       className='h-10!'
                                    >
                                       {item.label}
                                    </SelectItem>
                                 ))
                              }
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>
               }
               {
                  status &&
                  <div>
                     <Label className="text-[13px] 2xl:text-sm font-medium text-zinc-300 mb-2">
                        {status.label}
                     </Label>
                     <Select
                        value={draftStatus ?? 'NONE'}
                        onValueChange={(value) => handleStatusChange(value as UserStatus)}
                     >
                        <SelectTrigger className="w-full h-10! border-white/10">
                           <SelectValue placeholder="None">
                              {(val) => status.options.find((opt) => opt.value === val)?.label}
                           </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              {
                                 status.options.map((item) => (
                                    <SelectItem
                                       key={item.value}
                                       value={item.value}
                                       className='h-10!'
                                    >
                                       {item.label}
                                    </SelectItem>
                                 ))
                              }
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>
               }
            </div>
            <DrawerFooter className='flex flex-row items-center gap-2.5'>
               <Button
                  size='lg'
                  variant='ghost'
                  onClick={handleClear}
                  disabled={!Boolean(draftDate || draftRole || draftStatus)}
                  className='bg-red-500/10! text-red-400! w-1/2'
               >
                  clear
               </Button>
               <Button
                  size="lg"
                  onClick={handleApply}
                  className='w-1/2'
                  disabled={!Boolean(draftDate || draftRole || draftStatus)}
               >
                  Apply Filters
               </Button>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
