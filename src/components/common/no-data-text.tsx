import { AlertCircle } from 'lucide-react';
import PrimaryBody from './primary-body';
import { cn } from '@/lib/utils';

interface NoDataTextProps {
   text: string;
   className?: string;
}

const NoDataText = ({ text, className }: NoDataTextProps) => {
   return (
      <div className={cn("flex flex-col items-center justify-center text-center", className)}>

         {/* Icon */}
         <div className="h-10 w-10 rounded-xl bg-zinc-500/15 flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-zinc-400" />
         </div>

         {/* Description */}
         <PrimaryBody
            text={text || "There's nothing to show here yet. Once data is available, it will appear here."}
            className='max-w-md text-[13px]! 2xl:text-sm! text-center'
         />

      </div>
   );
};

export default NoDataText;