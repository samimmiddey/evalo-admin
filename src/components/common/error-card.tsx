import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import SecondaryTitle from './secondary-title';
import PrimaryBody from './primary-body';

interface ErrorCardProps {
   text: string;
   className?: string;
}

const ErrorCard = ({ text, className }: ErrorCardProps) => {
   return (
      <div className={cn("flex flex-col items-center justify-center py-8 2xl:py-10 px-6 bg-zinc-900/40 border border-dashed border-red-500/30 rounded-2xl w-full text-center", className)}>

         {/* Icon */}
         <div className="h-12 w-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
         </div>

         {/* Title */}
         <SecondaryTitle
            text="Something went wrong"
            className='mb-2'
         />

         {/* Description */}
         <PrimaryBody
            text={text || "An unexpected error occurred. Please try again later."}
            className='max-w-md text-sm! leading-relaxed text-center'
         />

      </div>
   );
};

export default ErrorCard;