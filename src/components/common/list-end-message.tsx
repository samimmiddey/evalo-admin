import PrimaryBody from './primary-body';
import { ListEnd } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListEndMessageProps {
   text: string;
   containerClassName?: string;
   className?: string;
   iconClassName?: string;
   showLines?: boolean;
   simpleVariant?: boolean;
}

const ListEndMessage = ({ text, containerClassName, className, iconClassName, showLines = true, simpleVariant = false }: ListEndMessageProps) => {
   return (
      <div
         role='status'
         className={cn('flex w-full select-none items-center gap-4 justify-center', containerClassName)}
      >
         {showLines && <span className='h-px flex-1 bg-linear-to-r from-transparent to-white/10' />}

         <div className={cn(`flex items-center gap-2 ${simpleVariant ? '' : 'border border-white/5 bg-zinc-900/70 py-1.5 pl-1.5 pr-3.5 rounded-full'}`, className)}>
            <span className={cn(`flex items-center justify-center ${simpleVariant ? 'mb-px h-auto w-auto' : 'rounded-full bg-white/5 ring-1 ring-white/10 h-5.5 w-5.5'}`, iconClassName)}>
               <ListEnd className='h-3.5 w-3.5 text-zinc-400' />
            </span>
            <PrimaryBody text={text} className='text-[13px]! font-medium tracking-wide text-zinc-400' />
         </div>

         {showLines && <span className='h-px flex-1 bg-linear-to-l from-transparent to-white/10' />}
      </div>
   );
};

export default ListEndMessage;