"use client";

import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { cancelBooking, getSessions, issueRefund } from './services/sessions.client.service';
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
import { useEffect, useRef, useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { DateRange } from 'react-day-picker';
import { BookingStatus, CompletionReason } from '@/generated/prisma/enums';
import { useMutation } from '@/hooks/use-mutation';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { GRACE_PERIOD_MS } from '@/constants/interview';
import { Textarea } from '@/components/ui/textarea';
import { sessionData as sessionStaticData } from '@/data/sessions/session.data';

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

interface ConfirmDialogue {
   id: string | null;
   value: boolean;
}

const INITIAL_CONFIRM_DIALOGUE: ConfirmDialogue = {
   id: null,
   value: false
};

const Sessions = () => {
   const [search, setSearch] = useState<string>('');
   const [filterButton, setFilterButton] = useState<boolean>(false);
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
   const [cancelDialogue, setCancelDialogue] = useState<ConfirmDialogue>(INITIAL_CONFIRM_DIALOGUE);
   const [refundDialogue, setRefundDialogue] = useState<ConfirmDialogue>(INITIAL_CONFIRM_DIALOGUE);
   const adminNoteRef = useRef<HTMLTextAreaElement>(null);

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

   const { isLoading: isSessionsLoading, data: sessionData, error: sessionError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch: refetchSessionList } = useInfiniteFetch<SessionItem>(
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

   // Cancel booking mutation
   const { isPending: isCancelBookingPending, error: cancelBookingError, mutate: cancelBookingMutation } = useMutation(cancelBooking);

   // Handle cancel booking
   const handleCancelBooking = async () => {
      if (!cancelDialogue.id) {
         toast.error('Booking ID not found');
         return;
      }

      const res = await cancelBookingMutation(cancelDialogue.id ?? '');

      if (res?.success) {
         toast.success('Booking successfully cancelled');
         setCancelDialogue(INITIAL_CONFIRM_DIALOGUE);
         refetchSessionList();
      }
   };

   // Issue refund mutation
   const { isPending: isRefundPending, error: isRefundError, mutate: refundMutation } = useMutation(issueRefund);

   // Handle issue refund
   const handleIssueRefund = async () => {
      if (!refundDialogue.id || !adminNoteRef.current?.value) {
         toast.error('Booking ID and admin note are required');
         return;
      }

      const res = await refundMutation({ bookingId: refundDialogue.id ?? '', adminNote: adminNoteRef.current?.value ?? '' });

      if (res?.success) {
         toast.success('Successfully refunded');
         setRefundDialogue(INITIAL_CONFIRM_DIALOGUE);
         refetchSessionList();
      }
   };

   // Handle mutation error
   useEffect(() => {
      if (cancelBookingError) {
         toast.error(cancelBookingError);
      }
      if (isRefundError) {
         toast.error(isRefundError);
      }
   }, [cancelBookingError, isRefundError]);

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
                     height={40}
                     width={40}
                     className='rounded-full'
                  />
                  <div className="flex flex-col items-start gap-0.5">
                     <SecondaryTitle
                        text={name ?? '-'}
                        className="text-xs! 2xl:text-sm! truncate"
                     />
                     <PrimaryBody
                        text={email ?? '-'}
                        className="text-xs! truncate"
                     />
                  </div>
               </div>
            );
         }
      },
      {
         accessorKey: 'interviewer',
         header: 'Interviewer',
         size: 275,
         cell: ({ row }) => {
            const { name, email, image } = row.original.interviewer;

            return (
               <div className="flex items-center gap-3">
                  <Image
                     src={image ?? '/user.png'}
                     alt='Image'
                     height={40}
                     width={40}
                     className='rounded-full'
                  />
                  <div className="flex flex-col items-start gap-0.5">
                     <SecondaryTitle
                        text={name ?? '-'}
                        className="text-xs! 2xl:text-sm! truncate"
                     />
                     <PrimaryBody
                        text={email ?? '-'}
                        className="text-xs! truncate"
                     />
                  </div>
               </div>
            );
         }
      },
      {
         accessorKey: 'time',
         header: 'Time',
         size: 175,
         cell: ({ row }) => {
            const { startTime, endTime } = row.original;

            return (
               <div className="flex flex-col gap-0.5">
                  <PrimaryBody
                     text={`${format(startTime, 'PP') ?? '-'}`}
                     className="text-xs!"
                  />
                  <PrimaryBody
                     text={`${format(startTime, 'p')} - ${format(endTime, 'p')}`}
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
         size: 160,
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
         size: 140,
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
         cell: ({ row }) => {
            const { id, status, startTime, endTime, isRefunded, completionReason, creditsCharged } = row.original;

            const canCancel = status === 'SCHEDULED' && new Date(endTime) > new Date() && !isRefunded;

            const now = Date.now();
            const startMs = new Date(startTime).getTime();
            const endMs = new Date(endTime).getTime();
            const settlementEndMs = endMs + GRACE_PERIOD_MS;

            const canIssueRefund =
               !isRefunded &&
               creditsCharged > 0 &&
               completionReason === null &&
               status !== 'COMPLETED' &&
               status !== 'CANCELLED' &&
               (
                  status === 'EXPIRED' ||
                  (status === 'SCHEDULED' && (now < startMs || now > settlementEndMs))
               );

            if (!canCancel && !canIssueRefund) {
               return <PrimaryBody text="-" className="text-xs!" />;
            }

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
                  />
                  <DropdownMenuContent>
                     <DropdownMenuGroup>
                        {
                           canIssueRefund &&
                           <DropdownMenuItem
                              className='h-8 cursor-pointer'
                              onClick={() => setRefundDialogue({ id, value: true })}
                           >
                              Issue Refund
                           </DropdownMenuItem>
                        }
                        {
                           canCancel &&
                           <DropdownMenuItem
                              className='h-8 cursor-pointer text-red-300 hover:text-red-400 hover:bg-red-500/15'
                              onClick={() => setCancelDialogue({ id, value: true })}
                           >
                              Cancel Session
                           </DropdownMenuItem>
                        }
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
               title: sessionStaticData.header.title,
               description: sessionStaticData.header.description
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

         {/* Cancel booking dialogue */}
         <ConfirmDialog
            open={cancelDialogue.value}
            onClose={() => setCancelDialogue(INITIAL_CONFIRM_DIALOGUE)}
            onConfirm={handleCancelBooking}
            title='Cancel Booking'
            description='Are you sure you want to do this? This action is permanent and cannot be undone.'
            confirmText='Confirm'
            variant='warning'
            isLoading={isCancelBookingPending}
         />

         {/* Issue refund dialogue */}
         <ConfirmDialog
            open={refundDialogue.value}
            onClose={() => setRefundDialogue(INITIAL_CONFIRM_DIALOGUE)}
            onConfirm={handleIssueRefund}
            title='Issue Refund'
            description='Are you sure you want to do this? This action is permanent and cannot be undone.'
            confirmText='Refund'
            variant='warning'
            isLoading={isRefundPending}
         >
            <Textarea
               className='w-full h-20 text-sm! placeholder:text-zinc-400/50'
               ref={adminNoteRef}
               placeholder='Refund note'
            />
         </ConfirmDialog>

      </div>
   );
};

export default Sessions;