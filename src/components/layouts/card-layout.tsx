import { cn } from '@/lib/utils';
import React from 'react';

interface CardLayoutProps {
   children: React.ReactNode;
   className?: string;
}

const CardLayout = ({ children, className }: CardLayoutProps) => {
   return (
      <div className={cn("relative overflow-hidden bg-zinc-900/40 border border-white/5 rounded-2xl p-6 2xl:p-8 transition-all duration-300 hover:border-white/10", className)}>
         {children}
      </div>
   );
};

export default CardLayout;