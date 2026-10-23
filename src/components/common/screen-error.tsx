import { cn } from "@/lib/utils";
import ErrorCard from "./error-card";

interface ScreenErrorProps {
   text: string;
   className?: string;
   pt?: boolean;
}

const ScreenError = ({ text, className, pt = true }: ScreenErrorProps) => {
   return (
      <div className={pt ? "s-padding-t" : ''}>
         <div className={cn("w-full flex items-center justify-center min-h-[56vh] px-4", className)}>
            <div
               className='flex items-center max-w-sm w-full'
            >
               <ErrorCard text={text} />
            </div>
         </div>
      </div>
   );
};

export default ScreenError;