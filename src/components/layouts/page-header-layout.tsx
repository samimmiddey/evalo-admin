import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageHeaderLayoutProps {
   className?: string;
   children: ReactNode;
}

const PageHeaderLayout = ({ className, children }: PageHeaderLayoutProps) => {
   return (
      <div className={cn('flex max-md:flex-col md:items-end md:justify-between gap-5 2xl:gap-6 mb-7 lg:mb-8 2xl:mb-9', className)}>
         {children}
      </div>
   );
};

export default PageHeaderLayout;