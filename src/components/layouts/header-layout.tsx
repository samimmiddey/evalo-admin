import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface HeaderLayoutProps {
   className?: string;
   children: ReactNode;
}

const HeaderLayout = ({ className, children }: HeaderLayoutProps) => {
   return (
      <div className={cn('flex flex-col gap-1.5 items-start w-full md:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mb-7 sm:mb-8 lg:mb-9 2xl:mb-10', className)}>
         {children}
      </div>
   );
};

export default HeaderLayout;