"use client";

import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { getSessions } from './services/sessions.client.service';
import { DataTable, features } from '@/components/common/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { SessionItem } from './types/sessions.types';
import Image from 'next/image';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';
import { format } from 'date-fns';
import getStatusBadge from '@/components/common/get-status-badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { DateRange } from 'react-day-picker';
import { BookingStatus, CompletionReason } from '@/generated/prisma/enums';

interface Filters {
   date?: DateRange;
   appliedDate?: DateRange;
   status?: BookingStatus;
   completionReason?: CompletionReason;
}

const INITIAL_FILTERS: Filters = {
   date: undefined,
   appliedDate: undefined,
   status: undefined,
   completionReason: undefined
};

const Sessions = () => {
   const [search, setSearch] = useState<string>('');
   const [filterButton, setFilterButton] = useState<boolean>(false);
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

   const debouncedSearch = useDebounce(search);

   const handleDateChange = (newRange: DateRange | undefined) => {
      setFilters((prev) => ({
         ...prev,
         date: newRange, // Updates calendar UI on first click
         // Only updates appliedDate when range is complete or cleared:
         ...((!newRange || (newRange.from && newRange.to)) ? { appliedDate: newRange } : {})
      }));
   };

   const params = {
      page: 1,
      pageSize: 10
   };

   const { isLoading: isSessionsLoading, data: sessionData, error: sessionError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteFetch<SessionItem>(
      (page) => getSessions({
         ...params,
         page,
         search: debouncedSearch,
         startDate: filters?.appliedDate?.from,
         endDate: filters?.appliedDate?.to,
         status: filters?.status,
         completionReason: filters?.completionReason
      }),
      [debouncedSearch, filters.appliedDate, filters.status, filters.completionReason]
   );

   const columns: ColumnDef<typeof features, SessionItem>[] = [
      {
         accessorKey: 'candidate',
         header: 'Candidate',
         size: 275,
         cell: ({ row }) => {
            const { name, image, email } = row.original.candidate;

            return (
               <div className="flex items-center gap-3">
                  <Image
                     src={image ?? '/user.png'}
                     alt='Image'
                     height={50}
                     width={50}
                     className='rounded-lg'
                  />
                  <div className="flex flex-col items-start gap-0.5">
                     <SecondaryTitle
                        text={name ?? '-'}
                        className="text-xs! 2xl:text-sm! truncate"
                     />
                     <PrimaryBody
                        text={email ?? '-'}
                        className="text-[13px]! truncate"
                     />
                  </div>
               </div>
            );
         }
      },
      {
         accessorKey: 'interviewer',
         header: 'Interviewer',
         size: 250,
         cell: ({ row }) => {
            const { name, email } = row.original.interviewer;

            return (
               <div className="flex flex-col items-start gap-0.5">
                  <SecondaryTitle
                     text={name ?? '-'}
                     className="text-xs! 2xl:text-sm! truncate"
                  />
                  <PrimaryBody
                     text={email ?? '-'}
                     className="text-[13px]! truncate"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'time',
         header: 'Time',
         size: 200,
         cell: ({ row }) => {
            const { startTime, endTime } = row.original;

            return (
               <div className="flex flex-col gap-0.5">
                  <PrimaryBody
                     text={`Start: ${format(startTime, 'PPp') ?? '-'}`}
                     className="text-xs!"
                  />
                  <PrimaryBody
                     text={`End: ${format(endTime, 'PPp') ?? '-'}`}
                     className="text-xs!"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'status',
         header: 'Account Status',
         size: 150,
         cell: (info) => (
            getStatusBadge(info.getValue<string>())
         )
      },
      {
         accessorKey: 'completionReason',
         header: 'Completion Reason',
         size: 150,
         cell: ({ row }) => {
            const { completionReason } = row.original;

            let message = '';

            switch (completionReason) {
               case 'CANDIDATE_NO_SHOW':
                  message = 'Candidate No-Show';
                  break;
               case 'MUTUAL':
                  message = 'Mutual';
                  break;
               default:
                  message = '-';
            }

            return (
               <PrimaryBody
                  text={message}
                  className="text-xs!"
               />
            );
         }
      },
      {
         accessorKey: 'isRefunded',
         header: 'Refund Status',
         size: 150,
         cell: ({ row }) => {
            const { isRefunded } = row.original;

            return (
               <PrimaryBody
                  text={isRefunded ? 'Refunded' : '-'}
                  className={`text-xs! ${isRefunded ? 'text-emerald-400' : ''}`}
               />
            );
         }
      },
      {
         accessorKey: 'actions',
         header: 'Actions',
         size: 100,
         cell: () => {
            return (
               <DropdownMenu>
                  <DropdownMenuTrigger
                     render={
                        <Button
                           variant="outline"
                           className='rounded-full p-0! h-7.5! w-7.5!'
                        >
                           <EllipsisVertical className='h-3.5 w-3.5' />
                        </Button>
                     }
                  >
                     Open
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuGroup>
                        <DropdownMenuItem className='h-8 cursor-pointer'>
                           Issue Refund
                        </DropdownMenuItem>
                        <DropdownMenuItem className='h-8 cursor-pointer'>
                           Cancel Session
                        </DropdownMenuItem>
                     </DropdownMenuGroup>
                  </DropdownMenuContent>
               </DropdownMenu>
            );
         }
      }
   ];

   return (
      <div className="container s-margin-t">
         <DataTable
            tableHeader={{
               title: 'Sessions',
               description: 'Manage all your sessions here'
            }}
            isLoading={isSessionsLoading}
            data={sessionData}
            columns={columns}
            error={sessionError}
            skeletonRows={8}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            contentType='Sessions'
            pageSize={params.pageSize}
            search={{
               value: search,
               onChange: (e) => setSearch(e.target.value),
               onClear: () => setSearch(''),
               placeholder: "Search users"
            }}
            filters={{
               value: filterButton,
               setValue: () => setFilterButton(prevState => !prevState),
               items: [
                  {
                     type: 'date',
                     id: 'date',
                     label: 'Select Date Range',
                     value: filters.date,
                     setValue: handleDateChange
                  },
                  {
                     type: 'select',
                     id: 'status',
                     label: 'Booking Status',
                     value: filters.status,
                     setValue: (value) => setFilters(prev => ({ ...prev, status: (value as BookingStatus) || undefined })),
                     options: [
                        { label: 'None', value: 'NONE' },
                        { label: 'Scheduled', value: 'SCHEDULED' },
                        { label: 'Completed', value: 'COMPLETED' },
                        { label: 'Cancelled', value: 'CANCELLED' },
                        { label: 'Expired', value: 'EXPIRED' }
                     ]
                  },
                  {
                     type: 'select',
                     id: 'completionReason',
                     label: 'Completion Reason',
                     value: filters.completionReason,
                     setValue: (value) => setFilters(prev => ({ ...prev, completionReason: (value as CompletionReason) || undefined })),
                     options: [
                        { label: 'None', value: 'NONE' },
                        { label: 'Mutual', value: 'MUTUAL' },
                        { label: 'Candidate No-Show', value: 'CANDIDATE_NO_SHOW' }
                     ]
                  }
               ],
               resetFilters: () => {
                  setFilters(INITIAL_FILTERS);
                  setFilterButton(false);
               }
            }}
         />
      </div>
   );
};

export default Sessions;