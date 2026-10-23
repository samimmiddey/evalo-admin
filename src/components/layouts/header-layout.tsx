import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface HeaderLayoutProps {
   className?: string;
   children: ReactNode;
}

const HeaderLayout = ({ className, children }: HeaderLayoutProps) => {
   return (
      <div className={cn('flex flex-col gap-3.5 xs:gap-4 lg:gap-4.5 2xl:gap-5.5 text-center items-center w-full md:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mx-auto mb-8 lg:mb-10 2xl:mb-12', className)}>
         {children}
      </div>
   );
};

export default HeaderLayout;