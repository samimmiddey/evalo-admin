import React from 'react';
import SecondaryTitle from '../secondary-title';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface DataTableHeaderProps {
   headerTitle?: string;
   viewAllLink?: string;
}

const DataTableHeader = ({ headerTitle, viewAllLink }: DataTableHeaderProps) => {
   return (
      <div className='mb-4 2xl:mb-5 flex items-center gap-4 justify-between'>
         <SecondaryTitle
            text={headerTitle ?? ''}
            className="text-zinc-300!"
         />
         {
            viewAllLink &&
            <Link href={viewAllLink}>
               <Button
                  className="cursor-pointer px-4 text-[13px]! h-9 transition-all duration-200 group shrink-0"
               >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
               </Button>
            </Link>
         }
      </div>
   );
};

export default DataTableHeader;