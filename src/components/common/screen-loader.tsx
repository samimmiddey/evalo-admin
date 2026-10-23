import { cn } from "@/lib/utils";
import CustomSpinner from "./custom-spinner";

interface ScreenLoaderProps {
   text: string;
   className?: string;
}

const ScreenLoader = ({ text, className }: ScreenLoaderProps) => {
   return (
      <div className={cn("w-full flex items-center justify-center min-h-[56vh]", className)}>
         <div
            className='border-gray-400/25! bg-gray-600/15! px-3.5 2xl:px-4 h-10 2xl:h-11 flex items-center border rounded-md w-max'
         >
            <CustomSpinner text={text} />
         </div>
      </div>
   );
};

export default ScreenLoader;