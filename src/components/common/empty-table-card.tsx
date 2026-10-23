import PrimaryBody from './primary-body';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyTableCardProps {
   text: string;
   className?: string;
   iconClassName?: string;
   textClassName?: string;
}

const EmptyTableCard = ({ text, className, iconClassName, textClassName }: EmptyTableCardProps) => {
   return (
      <div className={cn('flex items-center justify-center px-4 py-3 rounded-lg bg-zinc-900/40 border border-dashed border-white/10 w-max gap-2 mx-auto', className)}>
         <Database className={cn('h-4 w-4 text-zinc-400', iconClassName)} />
         <PrimaryBody text={text} className={cn('text-center text-zinc-400 text-sm!', textClassName)} />
      </div>
   );
};

export default EmptyTableCard;