"use client";

import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { getPayouts } from './services/payouts.client.service';
import { PayoutItem } from './types/payouts.types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, features } from '@/components/common/data-table/data-table';
import Image from 'next/image';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';
import getStatusBadge from '@/components/common/get-status-badge';
import { format } from 'date-fns';
import { useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { DateRange } from 'react-day-picker';
import { PayoutStatus } from '@/generated/prisma/enums';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format-currency';
import { payoutsData as payoutsStaticData } from '@/data/payouts/payouts.data';

interface Filters {
   date?: DateRange;
   status?: PayoutStatus;
   appliedDate?: DateRange;
}

const INITIAL_FILTERS: Filters = {
   status: undefined,
   date: undefined,
   appliedDate: undefined
};

const Payouts = () => {
   const [search, setSearch] = useState<string>('');
   const [filterButton, setFilterButton] = useState<boolean>(false);
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

   const params = {
      page: 1,
      pageSize: 10
   };

   const debouncedSearch = useDebounce(search);

   const handleDateChange = (newRange: DateRange | undefined) => {
      setFilters((prev) => ({
         ...prev,
         date: newRange, // Updates calendar UI on first click
         // Only updates appliedDate when range is complete or cleared:
         ...((!newRange || (newRange.from && newRange.to)) ? { appliedDate: newRange } : {})
      }));
   };

   const { isLoading: isPayoutsLoading, data: payoutsData, error: payoutsError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteFetch<PayoutItem>(
      page => getPayouts({
         ...params,
         page,
         search: debouncedSearch,
         startDate: filters.appliedDate?.from,
         endDate: filters.appliedDate?.to,
         status: filters?.status
      }),
      [debouncedSearch, filters.appliedDate, filters.status]
   );

   const columns: ColumnDef<typeof features, PayoutItem>[] = [
      {
         accessorKey: 'fullName',
         header: 'Full Name',
         size: 275,
         cell: ({ row }) => {
            const { name, image, email } = row.original.interviewer;

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
         accessorKey: 'netAmount',
         header: 'Amount',
         size: 120,
         cell: ({ row }) => {
            const { netAmount } = row.original;

            return (
               <PrimaryBody
                  text={formatCurrency(netAmount) ?? '-'}
                  className="text-xs!"
               />
            );
         }
      },
      {
         accessorKey: 'status',
         header: 'Payout Status',
         size: 150,
         cell: (info) => (
            getStatusBadge(info.getValue<string>())
         )
      },
      {
         accessorKey: 'createdAt',
         header: 'Creation Date',
         size: 120,
         cell: ({ row }) => {
            const { createdAt } = row.original;

            return (
               <div className='flex flex-col gap-0.5'>
                  <PrimaryBody
                     text={format(createdAt, 'PP') ?? '-'}
                     className="text-xs!"
                  />
                  <PrimaryBody
                     text={format(createdAt, 'p') ?? '-'}
                     className="text-[11px]! text-zinc-500"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'processedAt',
         header: 'Process Date',
         size: 120,
         cell: ({ row }) => {
            const { processedAt } = row.original;

            if (!processedAt) {
               return (
                  <PrimaryBody
                     text="-"
                     className="text-xs!"
                  />
               );
            }

            return (
               <div className='flex flex-col gap-0.5'>
                  <PrimaryBody
                     text={format(processedAt, 'PP') ?? '-'}
                     className="text-xs!"
                  />
                  <PrimaryBody
                     text={format(processedAt, 'p') ?? '-'}
                     className="text-[11px]! text-zinc-500"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'actions',
         header: 'Actions',
         size: 150,
         cell: ({ row }) => {
            const { status } = row.original;

            if (status !== 'PROCESSING') {
               return (
                  <PrimaryBody
                     text="-"
                     className="text-xs!"
                  />
               );
            }

            return (
               <div className='flex items-center gap-1.5'>
                  <Button
                     variant='ghost'
                     className='bg-rose-500/30 hover:bg-rose-500/50! text-xs!'
                  >
                     Reject
                  </Button>
                  <Button
                     variant='ghost'
                     className='bg-emerald-500/30 hover:bg-emerald-500/50! text-xs!'
                  >
                     Process
                  </Button>
               </div>
            );
         }
      }
   ];

   return (
      <div className='container s-margin-t'>
         <DataTable
            tableHeader={{
               title: payoutsStaticData.header.title,
               description: payoutsStaticData.header.description
            }}
            isLoading={isPayoutsLoading}
            error={payoutsError}
            data={payoutsData}
            skeletonRows={8}
            columns={columns}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            contentType='payout requests'
            pageSize={params.pageSize}
            search={{
               value: search,
               onChange: (e) => setSearch(e.target.value),
               onClear: () => setSearch(''),
               placeholder: "Search interviewers"
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
                     label: 'Select Status',
                     value: filters.status,
                     setValue: (value) => setFilters(prev => ({ ...prev, status: value as PayoutStatus || undefined })),
                     options: [
                        { label: 'None', value: 'NONE' },
                        { label: 'Processing', value: 'PROCESSING' },
                        { label: 'Processed', value: 'PROCESSED' },
                        { label: 'Rejected', value: 'REJECTED' }
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

export default Payouts;