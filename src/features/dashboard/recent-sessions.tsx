import SecondaryTitle from '@/components/common/secondary-title';
import { useFetch } from '@/hooks/use-fetch';
import { getRecentSessions } from './services/dashboard.client.service';
import { DataTable, features } from '@/components/common/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { PaginatedRecentSessions, RecentSessionItem } from './types/dashboard.types';
import PrimaryBody from '@/components/common/primary-body';
import getStatusBadge from '@/components/common/get-status-badge';
import { formatDate } from '@/utils/format-date';
import Image from 'next/image';

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

   const { isLoading, data, error } = useFetch<PaginatedRecentSessions>(
      () => getRecentSessions(params),
      [startDate, endDate]
   );

   const columns: ColumnDef<typeof features, RecentSessionItem>[] = [
      {
         accessorKey: 'name',
         header: 'Full Name',
         size: 250,
         cell: ({ row }) => {
            const { name, image } = row.original;

            return (
               <div className="flex items-center gap-3">
                  <Image
                     src={image ?? '/user.png'}
                     alt='Image'
                     height={50}
                     width={50}
                     className='rounded-lg'
                  />
                  <SecondaryTitle
                     text={name ?? '-'}
                     className="text-xs! 2xl:text-sm!"
                  />
               </div>
            );
         },
      },
      {
         accessorKey: 'email',
         header: 'Email',
         size: 150,
         cell: ({ row }) => {
            const { email } = row.original;

            return (
               <div className="flex items-center">
                  <PrimaryBody
                     text={email ?? '-'}
                     className="text-xs!"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'userCredit',
         header: 'Credit',
         size: 100,
         cell: ({ row }) => {
            const { userCredit } = row.original;

            return (
               <div className="flex items-center">
                  <PrimaryBody
                     text={userCredit.toString() ?? '-'}
                     className="text-xs!"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'status',
         header: 'Session Status',
         size: 150,
         cell: (info) => (
            getStatusBadge(info.getValue<string>())
         ),
      },
      {
         accessorKey: 'dateTime',
         header: 'Date',
         size: 150,
         cell: ({ row }) => {
            const { dateTime } = row.original;

            return (
               <PrimaryBody
                  text={formatDate(dateTime) ?? '-'}
                  className="text-xs!"
               />
            );
         },
      }
   ];

   return (
      <DataTable
         isLoading={isLoading}
         contentType='Recent Sessions'
         pageSize={params.pageSize}
         columns={columns}
         data={data?.data ?? []}
         error={error}
         tableHeader={true}
         headerTitle='Recent Interview Sessions'
         viewAllLink='/sessions'
      />
   );
};

export default RecentSessions;