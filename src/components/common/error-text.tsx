import { AlertCircle } from 'lucide-react';
import PrimaryBody from './primary-body';
import { cn } from '@/lib/utils';

interface ErrorTextProps {
   text: string;
   className?: string;
}

const ErrorText = ({ text, className }: ErrorTextProps) => {
   return (
      <div className={cn("flex flex-col items-center justify-center text-center", className)}>

         {/* Icon */}
         <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
         </div>

         {/* Description */}
         <PrimaryBody
            text={text || "An unexpected error occurred. Please try again later."}
            className='max-w-md text-[13px]! 2xl:text-sm! text-center'
         />

      </div>
   );
};

export default ErrorText;