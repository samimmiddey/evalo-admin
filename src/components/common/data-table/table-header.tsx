import SecondaryTitle from '../secondary-title';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PageHeaderLayout from '@/components/layouts/page-header-layout';
import HeaderLayout from '@/components/layouts/header-layout';
import PrimaryTitle from '../primary-title';
import PrimaryBody from '../primary-body';

interface DataTableHeaderProps {
   headerTitle?: string;
   headerDesc?: string;
   viewAllLink?: string;
   secondaryTitle?: boolean;
}

const DataTableHeader = ({ headerTitle, headerDesc, viewAllLink, secondaryTitle = false }: DataTableHeaderProps) => {
   return (
      <PageHeaderLayout className={secondaryTitle ? 'mb-4! 2xl:mb-5!' : ''}>
         {
            secondaryTitle ? (
               <SecondaryTitle
                  text={headerTitle ?? ''}
                  className="text-zinc-300!"
               />
            ) : (
               <HeaderLayout className="mb-0!">
                  <PrimaryTitle text={headerTitle ?? ''} />
                  <PrimaryBody
                     text={headerDesc ?? ''}
                     className="max-w-2xl"
                  />
               </HeaderLayout>
            )
         }
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
      </PageHeaderLayout>
   );
};

export default DataTableHeader;