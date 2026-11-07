"use client";

import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { getUsers } from './services/user.client.service';
import { DataTable, features } from '@/components/common/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { UserItem } from './types/users.types';
import Image from 'next/image';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';
import getStatusBadge from '@/components/common/get-status-badge';
import { formatDate } from '@/utils/format-date';
import { useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { DateRange } from 'react-day-picker';
import { UserRole, UserStatus } from '@/generated/prisma/enums';

interface Filters {
   date?: DateRange;
   role?: UserRole;
   status?: UserStatus;
   appliedDate?: DateRange;
}

const INITIAL_FILTERS: Filters = {
   role: undefined,
   status: undefined,
   date: undefined,
   appliedDate: undefined
};

const Users = () => {
   const [search, setSearch] = useState<string>('');
   const [filterButton, setFilterButton] = useState<boolean>(false);
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

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

   const debouncedSearch = useDebounce(search);

   const { isLoading: isUserLoading, data: userData, error: userError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteFetch<UserItem>(
      (page) => getUsers({
         ...params,
         page,
         search: debouncedSearch,
         startDate: filters.appliedDate?.from,
         endDate: filters.appliedDate?.to,
         role: filters?.role,
         status: filters?.status
      }),
      [debouncedSearch, filters.appliedDate, filters.role, filters.status]
   );

   const columns: ColumnDef<typeof features, UserItem>[] = [
      {
         accessorKey: 'name',
         header: 'Full Name',
         size: 200,
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
                     className="text-xs! 2xl:text-sm! truncate"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'email',
         header: 'Email',
         size: 200,
         cell: ({ row }) => {
            const { email } = row.original;

            return (
               <div className="flex items-center">
                  <PrimaryBody
                     text={email ?? '-'}
                     className="text-[13px]!"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'credits',
         header: 'Credits',
         size: 100,
         cell: ({ row }) => {
            const { credits } = row.original;

            return (
               <SecondaryTitle
                  text={credits.toString() ?? '-'}
                  className="text-xs! 2xl:text-sm!"
               />
            );
         }
      },
      {
         accessorKey: 'role',
         header: 'Role',
         size: 120,
         cell: ({ row }) => {
            const { role } = row.original;

            return (
               <PrimaryBody
                  text={role ?? '-'}
                  className="text-xs!"
               />
            );
         }
      },
      {
         accessorKey: 'status',
         header: 'Session Status',
         size: 150,
         cell: (info) => (
            getStatusBadge(info.getValue<string>())
         )
      },
      {
         accessorKey: 'joined',
         header: 'Joining Date',
         size: 150,
         cell: ({ row }) => {
            const { joined } = row.original;

            return (
               <div className="flex flex-col gap-0.5">
                  <PrimaryBody
                     text={formatDate(joined, "PP")}
                     className="text-xs!"
                  />
                  <PrimaryBody
                     text={formatDate(joined, "p")}
                     className="text-[11px]! text-zinc-500"
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'lastActive',
         header: 'Last Active',
         size: 150,
         cell: ({ row }) => {
            const { lastActive } = row.original;

            return (
               <div className="flex flex-col gap-0.5">
                  <PrimaryBody
                     text={formatDate(lastActive, "PP")}
                     className="text-xs!"
                  />
                  <PrimaryBody
                     text={formatDate(lastActive, "p")}
                     className="text-[11px]! text-zinc-500"
                  />
               </div>
            );
         }
      }
   ];

   return (
      <div className='s-margin-t container'>
         <DataTable
            isLoading={isUserLoading}
            skeletonRows={8}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            columns={columns}
            data={userData ?? []}
            error={userError}
            pageSize={params.pageSize}
            contentType='Users'
            tableHeader={{
               title: 'All Users',
               description: 'View and manage all registered users, their roles, and status.'
            }}
            search={{
               value: search,
               onChange: (e) => setSearch(e.target.value),
               onClear: () => setSearch(''),
               placeholder: "Search users"
            }}
            filters={{
               value: filterButton,
               setValue: () => setFilterButton(prevState => !prevState),
               date: {
                  label: 'Select Date Range',
                  value: filters.date,
                  setValue: handleDateChange
               },
               role: {
                  label: 'Select Role',
                  value: filters.role,
                  setValue: (value) => setFilters(prev => ({ ...prev, role: (value as UserRole) || undefined })),
                  options: [
                     { label: 'None', value: 'NONE' },
                     { label: 'Interviewer', value: 'INTERVIEWER' },
                     { label: 'Candidate', value: 'CANDIDATE' },
                     { label: 'Unassigned', value: 'UNASSIGNED' }
                  ]
               },
               status: {
                  label: 'Select Status',
                  value: filters.status,
                  setValue: (value) => setFilters(prev => ({ ...prev, status: value as UserStatus || undefined })),
                  options: [
                     { label: 'None', value: 'NONE' },
                     { label: 'Active', value: 'ACTIVE' },
                     { label: 'Banned', value: 'BANNED' }
                  ]
               },
               resetFilters: () => setFilters(INITIAL_FILTERS)
            }}
         />
      </div>
   );
};

export default Users;