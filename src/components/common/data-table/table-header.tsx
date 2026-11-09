import SecondaryTitle from '../secondary-title';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, Table, X } from 'lucide-react';
import PageHeaderLayout from '@/components/layouts/page-header-layout';
import HeaderLayout from '@/components/layouts/header-layout';
import PrimaryTitle from '../primary-title';
import PrimaryBody from '../primary-body';
import SearchBar from '../search-bar';
import { ExportCSV, Filters, Search } from './data-table';
import { FilterSidebar } from './filter-sidebar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';

interface DataTableHeaderProps {
   title: string;
   description?: string;
   secondaryTitle?: boolean;
   viewAllLink?: string;
   search?: Search;
   filters?: Filters;
   onExportCSV?: ExportCSV;
}

const DataTableHeader = ({ title, description, secondaryTitle = false, viewAllLink, search, filters, onExportCSV }: DataTableHeaderProps) => {
   const hasActiveFilters = filters?.items?.some(item => {
      if (item.type === 'date') return Boolean(item.value?.from && item.value?.to);
      if (item.type === 'select') return Boolean(item.value);

      return false;
   });

   return (
      <>
         <div className={secondaryTitle ? 'mb-4! 2xl:mb-5!' : 'mb-7 lg:mb-8 2xl:mb-9'}>
            <PageHeaderLayout className='mb-0! max-lg:flex-col! max-lg:justify-start! max-lg:items-start!'>
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
                  (search || filters || onExportCSV) &&
                  <div className="flex max-sm:flex-col sm:items-center gap-2.5 2xl:gap-3 max-lg:w-full">
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
                        (filters || onExportCSV) && (
                           <div className="flex items-center gap-2.5 2xl:gap-3 w-full sm:w-auto">
                              {
                                 filters &&
                                 <Button
                                    variant='outline'
                                    className='text-zinc-400 text-sm! px-3 h-10 relative flex-1 sm:flex-initial'
                                    onClick={filters.setValue}
                                 >
                                    <Filter /> Filters
                                    {
                                       hasActiveFilters &&
                                       <div className="absolute -right-1 -top-1 size-2 bg-red-500 rounded-full" />
                                    }
                                 </Button>
                              }
                              {
                                 onExportCSV &&
                                 <Button
                                    variant='outline'
                                    className='text-zinc-400 text-sm! px-3 h-10 relative flex-1 sm:flex-initial'
                                    onClick={onExportCSV.onDownload}
                                    disabled={onExportCSV.isPending}
                                 >
                                    {onExportCSV.isPending ? <Spinner /> : <Table />} Export CSV
                                 </Button>
                              }
                           </div>
                        )
                     }
                  </div>
               }
            </PageHeaderLayout>
            {
               hasActiveFilters &&
               <div className='flex items-center gap-2 flex-wrap mt-4'>
                  {
                     filters?.items?.map(item => {
                        if (item.type === 'date' && item.value?.from && item.value?.to) {
                           return (
                              <Badge
                                 key={item.id}
                                 className="bg-violet-500/15 text-violet-300 border border-violet-500/15 py-3 px-2.5 pr-0.5 gap-1.5"
                              >
                                 {format(item.value?.from, "PP")} - {format(item.value?.to, "PP")}
                                 <button
                                    type="button"
                                    onClick={() => item.setValue(undefined)}
                                    className="rounded-full shrink-0 h-5 w-5 flex items-center justify-center hover:bg-violet-500/25 text-violet-300 hover:text-violet-100 transition-colors cursor-pointer"
                                 >
                                    <X className="h-3.5 w-3.5" />
                                 </button>
                              </Badge>
                           );
                        }

                        if (item.type === 'select' && item.value) {
                           const label = item.options.find(opt => opt.value === item.value)?.label ?? item.value;

                           return (
                              <Badge
                                 key={item.id}
                                 className="bg-violet-500/15 text-violet-300 border border-violet-500/15 py-3 px-2.5 pr-0.5 gap-1.5"
                              >
                                 {label}
                                 <button
                                    type="button"
                                    onClick={() => item.setValue(null)}
                                    className="rounded-full shrink-0 h-5 w-5 flex items-center justify-center hover:bg-violet-500/25 text-violet-300 hover:text-violet-100 transition-colors cursor-pointer"
                                 >
                                    <X className="h-3.5 w-3.5" />
                                 </button>
                              </Badge>
                           );
                        }
                     })
                  }
               </div>
            }
         </div>
         {
            filters &&
            <FilterSidebar
               open={filters.value}
               setOpen={filters.setValue}
               items={filters.items}
               onResetFilters={filters.resetFilters}
            />
         }
      </>
   );
};

export default DataTableHeader;