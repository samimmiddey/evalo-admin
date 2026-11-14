"use client";

import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { getPayouts, exportPayoutsCsv, approvePayout, rejectPayout } from './services/payouts.client.service';
import { PayoutItem } from './types/payouts.types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, features } from '@/components/common/data-table/data-table';
import Image from 'next/image';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';
import getStatusBadge from '@/components/common/get-status-badge';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { DateRange } from 'react-day-picker';
import { PayoutStatus } from '@/generated/prisma/enums';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format-currency';
import { payoutsData as payoutsStaticData } from '@/data/payouts/payouts.data';
import { useMutation } from '@/hooks/use-mutation';
import { toast } from 'sonner';
import ConfirmDialog, { ConfirmDialogVariant } from '@/components/common/confirm-dialog';
import { CircleCheckBig, Copy } from 'lucide-react';
import { copyText } from '@/utils/copy-text';

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

type ConfirmDialogueType = 'APPROVE' | 'REJECT' | null;

interface ConfirmDialogue {
   id: string | null;
   value: boolean;
   type: ConfirmDialogueType;
}

interface DialogueConfigOptions {
   title: string;
   description: string;
   onConfirm: () => void;
   confirmText: string;
   variant: ConfirmDialogVariant;
   isLoading: boolean;
}

type DialogueConfig = DialogueConfigOptions | null;

const Payouts = () => {
   const [search, setSearch] = useState<string>('');
   const [filterButton, setFilterButton] = useState<boolean>(false);
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
   const [confirmDialogue, setConfirmDialogue] = useState<ConfirmDialogue>({
      id: null,
      value: false,
      type: null
   });
   const [copied, setCopied] = useState<boolean>(false);

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

   // Payout request list
   const { isLoading: isPayoutsLoading, data: payoutsData, error: payoutsError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch: refecthPayouts } = useInfiniteFetch<PayoutItem>(
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

   // CSV Download mutation
   const { isPending: isExportCSVPending, error: exportCSVError, mutate: exportCSVMutation } = useMutation(exportPayoutsCsv);

   // Handle export CSV
   const handleExportCSV = async () => {
      const res = await exportCSVMutation({
         search,
         status: filters?.status,
         startDate: filters?.appliedDate?.from,
         endDate: filters?.appliedDate?.to,
      });

      if (res?.csv) {
         const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', res.filename || 'payouts.csv');
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         URL.revokeObjectURL(url);
         toast.success('CSV file downloaded successfully');
      }
   };

   // Approve payout request mutation
   const { isPending: isApprovePayoutPending, error: isApprovePayoutError, mutate: approvePayoutMutation } = useMutation(approvePayout);

   // Handle approve payout request
   const handleApprovePayoutRequest = async () => {
      if (!confirmDialogue.id) {
         toast.error("Payout ID is required");
         return;
      }

      const res = await approvePayoutMutation({ payoutId: confirmDialogue.id });
      if (res?.success) {
         toast.success("Payout request is approved");
         setConfirmDialogue({ id: null, value: false, type: null });
         refecthPayouts();
      }
   };

   // Reject payout request mutation
   const { isPending: isRejectPayoutPending, error: isRejectPayoutError, mutate: rejectPayoutMutation } = useMutation(rejectPayout);

   // Handle reject payout request
   const handleRejectPayoutRequest = async () => {
      if (!confirmDialogue.id) {
         toast.error("Payout ID is required");
         return;
      }

      const res = await rejectPayoutMutation({ payoutId: confirmDialogue.id });
      if (res?.success) {
         toast.success("Payout request is successfully rejected");
         setConfirmDialogue({ id: null, value: false, type: null });
         refecthPayouts();
      }
   };

   // Handle mutation error
   useEffect(() => {
      if (exportCSVError) {
         toast.error('Failed to export the CSV');
      }

      if (isApprovePayoutError) {
         toast.error('Failed to approve payout request');
      }

      if (isRejectPayoutError) {
         toast.error('Failed to reject payout request');
      }
   }, [exportCSVError, isApprovePayoutError, isRejectPayoutError]);

   // Handle copy cashgram Url
   const handleCopyText = async (value: string) => {
      const ok = await copyText(value);
      if (ok) {
         setCopied(true);
         setTimeout(() => setCopied(false), 1500);
      }
   };

   // Set the dialogue options
   const dialogueConfig: DialogueConfig = confirmDialogue.type ? {
      APPROVE: {
         title: "Approve payout request",
         description: "Are you sure you want to approve this payout request? This action is permanent and cannot be undone.",
         onConfirm: handleApprovePayoutRequest,
         confirmText: "Approve",
         variant: "warning" as const,
         isLoading: isApprovePayoutPending
      },
      REJECT: {
         title: "Reject payout request",
         description: "Are you sure you want to reject this payout request? This action is permanent and cannot be undone.",
         onConfirm: handleRejectPayoutRequest,
         confirmText: "Reject",
         variant: "destructive" as const,
         isLoading: isRejectPayoutPending,
      }
   }[confirmDialogue.type] : null;

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
         size: 110,
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
         size: 130,
         cell: (info) => (
            getStatusBadge(info.getValue<string>())
         )
      },
      {
         accessorKey: 'cashgramUrl',
         header: 'Cashgram URL',
         size: 150,
         cell: ({ row }) => {
            const { cashgramUrl } = row.original;

            return (
               <div className="flex items-center gap-2">
                  <a
                     className={`text-[13px] font-semibold block max-w-30 truncate ${cashgramUrl ? 'text-blue-500 hover:underline' : 'text-zinc-400'}`}
                     target='_blank'
                     rel='noreferrer'
                     href={cashgramUrl || undefined}
                  >
                     {cashgramUrl || '-'}
                  </a>
                  {
                     cashgramUrl &&
                     (
                        copied ?
                           <CircleCheckBig className='h-3.5 w-3.5 text-emerald-400' /> :
                           <Copy
                              className='h-3.5 w-3.5 text-zinc-400 cursor-pointer'
                              onClick={() => void handleCopyText(cashgramUrl)}
                           />
                     )
                  }
               </div>
            );
         }
      },
      {
         accessorKey: 'createdAt',
         header: 'Creation Date',
         size: 130,
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
         size: 130,
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
         size: 175,
         cell: ({ row }) => {
            const { status, id } = row.original;

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
                     onClick={() => setConfirmDialogue({ id, value: true, type: 'REJECT' })}
                  >
                     Reject
                  </Button>
                  <Button
                     variant='ghost'
                     className='bg-emerald-500/30 hover:bg-emerald-500/50! text-xs!'
                     onClick={() => setConfirmDialogue({ id, value: true, type: 'APPROVE' })}
                  >
                     Approve
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
                        { label: 'Approved', value: 'APPROVED' },
                        { label: 'Processed', value: 'PROCESSED' },
                        { label: 'Rejected', value: 'REJECTED' },
                        { label: 'Expired', value: 'EXPIRED' },
                     ]
                  }
               ],
               resetFilters: () => {
                  setFilters(INITIAL_FILTERS);
                  setFilterButton(false);
               }
            }}
            onExportCSV={{
               isPending: isExportCSVPending,
               onDownload: () => {
                  void handleExportCSV();
               }
            }}
         />

         {/* Approve or reject payout request */}
         {
            dialogueConfig &&
            <ConfirmDialog
               open={confirmDialogue.value}
               onClose={() => setConfirmDialogue({ id: null, value: false, type: null })}
               title={dialogueConfig.title}
               description={dialogueConfig.description}
               onConfirm={dialogueConfig.onConfirm}
               confirmText={dialogueConfig.confirmText}
               variant={dialogueConfig.variant}
               isLoading={dialogueConfig.isLoading}
            />
         }

      </div>
   );
};

export default Payouts;