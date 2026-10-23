import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface CustomSpinnerProps {
   text: string;
   containerClass?: string;
   spinnerClass?: string;
   textClass?: string;
}

const CustomSpinner = ({ text, containerClass, spinnerClass, textClass }: CustomSpinnerProps) => {
   return (
      <div className={cn('flex items-center gap-2 2xl:gap-2.5', containerClass)}>
         <Spinner className={cn('size-4.5 2xl:size-5 text-zinc-300', spinnerClass)} />
         <p className={cn('text-sm text-zinc-300', textClass)}>{text}</p>
      </div>
   )
};

export default CustomSpinner;