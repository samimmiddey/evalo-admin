"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { columnSizingFeature, tableFeatures, useTable, type ColumnDef, type RowData } from '@tanstack/react-table';
import TableSkeleton from './table-skeleton';
import { usePaginationTrigger } from '@/hooks/use-pagination-trigger';
import ListEndMessage from '../list-end-message';

export const features = tableFeatures({
   columnSizingFeature
});

interface DataTableProps<TData extends RowData> {
   columns: ColumnDef<typeof features, TData>[];
   data: TData[];
   isLoading?: boolean;
   hasNextPage?: boolean;
   isFetchingNextPage?: boolean;
   fetchNextPage?: () => void;
   pageSize: number;
   contentType: string;
}

export function DataTable<TData extends RowData>({
   columns,
   data,
   isLoading,
   hasNextPage,
   isFetchingNextPage,
   fetchNextPage,
   pageSize,
   contentType
}: DataTableProps<TData>) {
   const table = useTable({ features, columns, data });

   const { ref: sentinelRef } = usePaginationTrigger({
      onIntersect: fetchNextPage ?? (() => undefined),
      enabled: hasNextPage,
      isFetching: isFetchingNextPage
   });

   return (
      <div>
         <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm transition-all duration-300">
            <Table className="w-full table-fixed min-w-200">
               <TableHeader className="border-b border-white/5 bg-zinc-900/60">
                  {
                     table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} className="border-b border-white/5 hover:bg-transparent">
                           {
                              headerGroup.headers.map((header) => (
                                 <TableHead
                                    key={header.id}
                                    style={{ width: `${header.getSize()}px` }}
                                    className="h-11 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
                                 >
                                    {header.isPlaceholder ? null : (
                                       <table.FlexRender header={header} />
                                    )}
                                 </TableHead>
                              ))
                           }
                        </TableRow>
                     ))
                  }
               </TableHeader>
               <TableBody className="divide-y divide-white/5">
                  {
                     isLoading ? (
                        <TableSkeleton columns={columns.length} />
                     ) : (
                        <>
                           {/* Existing rendered rows */}
                           {
                              table.getRowModel().rows.map(row => (
                                 <TableRow
                                    key={row.id}
                                    className="border-b border-white/5 transition-colors hover:bg-white/2"
                                 >
                                    {
                                       row.getAllCells().map(cell => (
                                          <TableCell key={cell.id} className="px-4 py-3.5 text-sm text-zinc-300 align-middle">
                                             <table.FlexRender cell={cell} />
                                          </TableCell>
                                       ))
                                    }
                                 </TableRow>
                              ))
                           }
                           {/* Bottom Loader: Render extra skeleton rows while fetching next page */}
                           {isFetchingNextPage && (
                              <TableSkeleton rows={3} columns={columns.length} />
                           )}
                        </>
                     )
                  }
               </TableBody>
            </Table>
         </div>

         {/* Invisible sentinel that triggers fetchNextPage when scrolled into view */}
         <div ref={sentinelRef} className="h-4 mt-1" />

         {/* End of list message */}
         {!hasNextPage && data?.length > pageSize && (
            <div className='mt-3 2xl:mt-5'>
               <ListEndMessage text={`Showing all ${data.length} ${contentType}`} />
            </div>
         )}
      </div>
   );
}