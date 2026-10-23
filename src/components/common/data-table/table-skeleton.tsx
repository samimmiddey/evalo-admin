import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableSkeletonProps {
   rows?: number;
   columns: number;
}

const TableSkeleton = ({ rows = 5, columns }: TableSkeletonProps) => {
   return (
      <>
         {
            Array.from({ length: rows }).map((_, i) => (
               <TableRow key={i} className="hover:bg-transparent">
                  {
                     Array.from({ length: columns }).map((_, j) => (
                        <TableCell key={j}>
                           <Skeleton className="h-6 w-full bg-zinc-800/60" />
                        </TableCell>
                     ))
                  }
               </TableRow>
            ))
         }
      </>
   );
};

export default TableSkeleton;