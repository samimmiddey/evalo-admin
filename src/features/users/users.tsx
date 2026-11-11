"use client";

import { useInfiniteFetch } from '@/hooks/use-infinite-fetch';
import { toggleUserStatus, getUsers, signOutUser, exportUsersCsv } from './services/user.client.service';
import { DataTable, features } from '@/components/common/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { UserItem } from './types/users.types';
import Image from 'next/image';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';
import getStatusBadge from '@/components/common/get-status-badge';
import { formatDate } from '@/utils/format-date';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { DateRange } from 'react-day-picker';
import { UserRole, UserStatus } from '@/generated/prisma/enums';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { useMutation } from '@/hooks/use-mutation';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { UserDetailsModal } from './components/user-details-modal';
import { usersData } from '@/data/users/users.data';

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

interface ConfirmationDialogue {
   user: UserItem | null;
   value: boolean;
   type: 'AUTH' | 'STATUS' | null;
}

const Users = () => {
   const [search, setSearch] = useState<string>('');
   const [filterButton, setFilterButton] = useState<boolean>(false);
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
   const [viewUserId, setViewUserId] = useState<string | null>(null);
   const [confirmDialogue, setConfirmDialogue] = useState<ConfirmationDialogue>({
      user: null,
      value: false,
      type: null
   });

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

   // Get user list with filters and pagination
   const { isLoading: isUserLoading, data: userData, error: userError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch: refetchUserList } = useInfiniteFetch<UserItem>(
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

   // Toggle user status mutation
   const { isPending: isToggleUserStatusPending, error: toggleUserStatusError, mutate: mutateToggleUserStatus } = useMutation(toggleUserStatus);

   // Handle toggle user status
   const handleToggleUserStatus = async () => {
      if (!confirmDialogue.user) {
         toast.error('User not found');
         return;
      }

      const res = await mutateToggleUserStatus(confirmDialogue.user?.id ?? '');

      if (res?.success) {
         toast.success('Successfully updated user status');
         setConfirmDialogue({ user: null, value: false, type: null });
         refetchUserList();
      }
   };

   // Sign out user mutation
   const { isPending: isSignOutUserPending, error: signOutUserError, mutate: signOutUserMutation } = useMutation(signOutUser);

   // Handle sign out user
   const handleSignOutUser = async () => {
      if (!confirmDialogue.user) {
         toast.error('User not found');
         return;
      }

      const res = await signOutUserMutation(confirmDialogue.user?.id ?? '');

      if (res?.success) {
         toast.success('Successfully signed user out');
         setConfirmDialogue({ user: null, value: false, type: null });
         refetchUserList();
      }
   };

   // CSV Downlaod mutation
   const { isPending: isExportCSVPending, error: exportCSVError, mutate: exportCSVMutation } = useMutation(exportUsersCsv);

   // Handle export CSV
   const handleExportCSV = async () => {
      const res = await exportCSVMutation({
         search,
         role: filters?.role,
         status: filters?.status,
         startDate: filters?.appliedDate?.from,
         endDate: filters?.appliedDate?.to
      });

      if (res?.csv) {
         const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', res.filename || 'users.csv');
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         URL.revokeObjectURL(url);
         toast.success('CSV file downloaded successfully');
      }
   };

   // Show mutation error toast
   useEffect(() => {
      if (toggleUserStatusError) {
         toast.error('Failed to update user status');
      }

      if (signOutUserError) {
         toast.error('Failed to sign out user');
      }

      if (exportCSVError) {
         toast.error('Failed to export the CSV');
      }
   }, [toggleUserStatusError, signOutUserError, exportCSVError]);

   const columns: ColumnDef<typeof features, UserItem>[] = [
      {
         accessorKey: 'name',
         header: 'Full Name',
         size: 275,
         cell: ({ row }) => {
            const { name, image, email } = row.original;

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
         accessorKey: 'status',
         header: 'Account Status',
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
      },
      {
         accessorKey: 'sessionStatus',
         header: 'Session Status',
         size: 150,
         cell: ({ row }) => {
            const { hasActiveSession } = row.original;

            return (
               <PrimaryBody
                  text={hasActiveSession.toString() === 'true' ? 'Signed In' : 'Signed Out'}
                  className={`text-xs! font-medium ${hasActiveSession ? 'text-emerald-400' : 'text-rose-400'}`}
               />
            );
         }
      },
      {
         accessorKey: 'actions',
         header: 'Actions',
         size: 100,
         cell: ({ row }) => {
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
                        <DropdownMenuItem
                           className='h-8 cursor-pointer'
                           onClick={() => setViewUserId(row.original.id)}
                        >
                           View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           className='h-8 cursor-pointer'
                           onClick={() => setConfirmDialogue({
                              user: row.original,
                              value: true,
                              type: 'STATUS'
                           })}
                        >
                           {row.original.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                        </DropdownMenuItem>
                        {
                           row.original.hasActiveSession &&
                           <DropdownMenuItem
                              className='h-8 cursor-pointer text-red-300 hover:text-red-400 hover:bg-red-500/15'
                              onClick={() => setConfirmDialogue({
                                 user: row.original,
                                 value: true,
                                 type: 'AUTH'
                              })}
                           >
                              Sign Out
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
            contentType='users'
            tableHeader={{
               title: usersData.header.title,
               description: usersData.header.description
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
                     id: 'role',
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
                  {
                     type: 'select',
                     id: 'status',
                     label: 'Select Status',
                     value: filters.status,
                     setValue: (value) => setFilters(prev => ({ ...prev, status: value as UserStatus || undefined })),
                     options: [
                        { label: 'None', value: 'NONE' },
                        { label: 'Active', value: 'ACTIVE' },
                        { label: 'Banned', value: 'BANNED' }
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
         <ConfirmDialog
            open={confirmDialogue.value}
            onClose={() => setConfirmDialogue({ user: null, value: false, type: null })}
            onConfirm={confirmDialogue.type === 'STATUS' ? handleToggleUserStatus : handleSignOutUser}
            title={confirmDialogue.type === 'STATUS' ? `${confirmDialogue.user?.status === 'ACTIVE' ? 'Ban' : 'Unban'} User` : 'Sign Out User'}
            description={confirmDialogue.type === 'STATUS' ? `Are you sure you want to ${confirmDialogue.user?.status === 'ACTIVE' ? 'ban' : 'unban'} the user? This action is not permanent and is reversible.` : 'Are you sure you want to sign this user out? This action will sign out the user everywhere and the user need to sign in again to access their account.'}
            confirmText='Confirm'
            variant='destructive'
            isLoading={confirmDialogue.type === 'STATUS' ? isToggleUserStatusPending : isSignOutUserPending}
         />
         {
            viewUserId &&
            <UserDetailsModal
               userId={viewUserId}
               open={Boolean(viewUserId)}
               onClose={() => setViewUserId(null)}
            />
         }
      </div>
   );
};

export default Users;