import SecondaryTitle from '@/components/common/secondary-title';
import { DataTable, features } from '@/components/common/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import PrimaryBody from '@/components/common/primary-body';
import getStatusBadge from '@/components/common/get-status-badge';
import Image from 'next/image';
import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { SessionItem } from '../sessions/types/sessions.types';
import { getSessions } from '../sessions/services/sessions.client.service';
import { format } from 'date-fns';

interface RecentSessionsProps {
   startDate: Date | undefined;
   endDate: Date | undefined;
}

const RecentSessions = ({ startDate, endDate }: RecentSessionsProps) => {
   const params = {
      page: 1,
      pageSize: 10,
      startDate,
      endDate
   };

   const { isLoading, data, error } = useInfiniteFetch<SessionItem>(
      () => getSessions(params),
      [startDate, endDate]
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
      }
   ];

   return (
      <DataTable
         isLoading={isLoading}
         contentType='Recent Sessions'
         pageSize={params.pageSize}
         columns={columns}
         data={data}
         error={error}
         tableHeader={{
            title: 'Recent Interview Sessions'
         }}
         secondaryTitle={true}
         viewAllLink='/sessions'
      />
   );
};

export default RecentSessions;