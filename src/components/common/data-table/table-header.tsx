import SecondaryTitle from '../secondary-title';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter } from 'lucide-react';
import PageHeaderLayout from '@/components/layouts/page-header-layout';
import HeaderLayout from '@/components/layouts/header-layout';
import PrimaryTitle from '../primary-title';
import PrimaryBody from '../primary-body';
import SearchBar from '../search-bar';
import { Filters, Search } from './data-table';
import { FilterSidebar } from './filter-sidebar';

interface DataTableHeaderProps {
   title: string;
   description?: string;
   secondaryTitle?: boolean;
   viewAllLink?: string;
   search?: Search;
   filters?: Filters;
}

const DataTableHeader = ({ title, description, secondaryTitle = false, viewAllLink, search, filters }: DataTableHeaderProps) => {
   return (
      <PageHeaderLayout className={secondaryTitle ? 'mb-4! 2xl:mb-5!' : ''}>
         <div className={viewAllLink ? 'flex items-center gap-4 justify-between w-full' : ''}>
            {
               secondaryTitle ? (
                  <SecondaryTitle
                     text={title ?? ''}
                     className="text-zinc-300!"
                  />
               ) : (
                  <HeaderLayout className="mb-0!">
                     <PrimaryTitle text={title ?? ''} />
                     <PrimaryBody
                        text={description ?? ''}
                        className="max-w-2xl"
                     />
                  </HeaderLayout>
               )
            }
            {
               viewAllLink &&
               <Link href={viewAllLink}>
                  <Button
                     className="cursor-pointer px-4 text-[13px]! transition-all duration-200 group shrink-0 text-zinc-400 h-10!"
                     variant='ghost'
                  >
                     View All
                     <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
               </Link>
            }
         </div>
         {
            (search || filters) &&
            <div className="flex sm:items-center gap-3 max-sm:flex-col">
               {
                  search && (
                     <SearchBar
                        value={search.value}
                        setValue={search.onChange}
                        onClear={search.onClear}
                        placeholder={search.placeholder}
                        showLabel={false}
                     />
                  )
               }
               {
                  filters &&
                  <>
                     <Button
                        variant='outline'
                        className='text-zinc-400 text-sm! px-3 h-10'
                        onClick={filters.setValue}
                     >
                        <Filter /> Filters
                     </Button>
                     <FilterSidebar
                        open={filters.value}
                        setOpen={filters.setValue}
                        date={filters.date}
                        role={filters.role}
                        status={filters.status}
                        onResetFilters={filters.resetFilters}
                     />
                  </>
               }
            </div>
         }
      </PageHeaderLayout>
   );
};

export default DataTableHeader;