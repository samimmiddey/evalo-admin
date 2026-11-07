import SecondaryTitle from '../secondary-title';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, X } from 'lucide-react';
import PageHeaderLayout from '@/components/layouts/page-header-layout';
import HeaderLayout from '@/components/layouts/header-layout';
import PrimaryTitle from '../primary-title';
import PrimaryBody from '../primary-body';
import SearchBar from '../search-bar';
import { Filters, Search } from './data-table';
import { FilterSidebar } from './filter-sidebar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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
      <div className={secondaryTitle ? 'mb-4! 2xl:mb-5!' : 'mb-7 lg:mb-8 2xl:mb-9'}>
         <PageHeaderLayout className='mb-0!'>
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
                           className='text-zinc-400 text-sm! px-3 h-10 relative'
                           onClick={filters.setValue}
                        >
                           <Filter /> Filters
                           {
                              ((filters.date?.value?.from && filters.date?.value?.to) || filters.role?.value || filters.status?.value) &&
                              <div className="absolute -right-1 -top-1 size-2 bg-red-500 rounded-full" />
                           }
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
         {
            (filters && ((filters.date?.value?.from && filters.date?.value?.to) || filters.role?.value || filters.status?.value)) &&
            <div className='flex items-center gap-2 flex-wrap mt-4'>
               {
                  filters.date?.value?.from && filters.date?.value?.to &&
                  <Badge className="bg-violet-500/15 text-violet-300 border border-violet-500/15 py-3 px-2.5 pr-0.5 gap-1.5">
                     {format(filters.date?.value.from, "PP")} - {format(filters.date?.value.to, "PP")}
                     <button
                        type="button"
                        onClick={() => filters.date?.setValue(undefined)}
                        className="rounded-full shrink-0 h-5 w-5 flex items-center justify-center hover:bg-violet-500/25 text-violet-300 hover:text-violet-100 transition-colors cursor-pointer"
                     >
                        <X className="h-3.5 w-3.5" />
                     </button>
                  </Badge>
               }
               {
                  filters.role?.value &&
                  <Badge className="bg-violet-500/15 text-violet-300 border border-violet-500/15 py-3 px-2.5 pr-0.5 gap-1.5">
                     {filters.role?.value.slice(0, 1) + filters.role?.value.slice(1).toLowerCase()}
                     <button
                        type="button"
                        onClick={() => filters.role?.setValue(null)}
                        className="rounded-full shrink-0 h-5 w-5 flex items-center justify-center hover:bg-violet-500/25 text-violet-300 hover:text-violet-100 transition-colors cursor-pointer"
                     >
                        <X className="h-3.5 w-3.5" />
                     </button>
                  </Badge>
               }
               {
                  filters.status?.value &&
                  <Badge className="bg-violet-500/15 text-violet-300 border border-violet-500/15 py-3 px-2.5 pr-0.5 gap-1.5">
                     {filters.status?.value.slice(0, 1) + filters.status?.value.slice(1).toLowerCase()}
                     <button
                        type="button"
                        onClick={() => filters.status?.setValue(null)}
                        className="rounded-full shrink-0 h-5 w-5 flex items-center justify-center hover:bg-violet-500/25 text-violet-300 hover:text-violet-100 transition-colors cursor-pointer"
                     >
                        <X className="h-3.5 w-3.5" />
                     </button>
                  </Badge>
               }
            </div>
         }
      </div>
   );
};

export default DataTableHeader;