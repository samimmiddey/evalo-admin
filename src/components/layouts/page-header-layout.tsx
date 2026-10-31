import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageHeaderLayoutProps {
   className?: string;
   children: ReactNode;
}

const PageHeaderLayout = ({ className, children }: PageHeaderLayoutProps) => {
   return (
      <div className={cn('flex max-md:flex-col md:items-end md:justify-between gap-5 2xl:gap-6 mb-7 sm:mb-8 lg:mb-9 2xl:mb-10', className)}>
         {children}
      </div>
   );
};

export default PageHeaderLayout;