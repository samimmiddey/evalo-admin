"use client";

import { Button } from "@/components/ui/button";
import {
   Drawer,
   DrawerClose,
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

interface FilterSidebarProps {
   open: boolean;
   setOpen: () => void;
   date?: Date;
   role?: Role;
   status?: Status;
   onResetFilters?: () => void;
}

export function FilterSidebar({ open, setOpen, date, role, status, onResetFilters }: FilterSidebarProps) {
   const smWidth = useMediaQuery(768);

   return (
      <Drawer
         open={open}
         onOpenChange={setOpen}
         showSwipeHandle={Boolean(smWidth)}
         swipeDirection={smWidth ? "down" : "right"}
      >
         <DrawerContent className='border-white/5 bg-zinc-900'>
            <DrawerHeader>
               <SecondaryTitle
                  text='Filters'
                  className='text-base 2xl:text-lg font-medium'
               />
               <PrimaryBody
                  text='Apply filters to refine your search results'
                  className='text-[13px] 2xl:text-sm'
               />
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-6 my-4">
               {
                  date &&
                  <div>
                     <Label className="text-[13px] 2xl:text-sm font-medium text-zinc-300 mb-2">
                        {date.label}
                     </Label>
                     <DateRangePicker
                        date={date.value}
                        setDate={date.setValue}
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
                        value={role.value ?? 'NONE'}
                        onValueChange={(value) => {
                           role.setValue(value === 'NONE' ? null : value);
                        }}
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
                        value={status.value ?? 'NONE'}
                        onValueChange={(value) => {
                           status.setValue(value === 'NONE' ? null : value);
                        }}
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
            <DrawerFooter>
               {
                  (date?.value || role?.value || status?.value) &&
                  <Button
                     size='lg'
                     variant='ghost'
                     onClick={onResetFilters}
                     className='bg-red-500/10! text-red-400!'
                  >
                     clear
                  </Button>
               }
               <DrawerClose
                  render={
                     <Button
                        variant="outline"
                        size='lg'
                     />
                  }
               >
                  Close
               </DrawerClose>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
