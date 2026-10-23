import { cn } from "@/lib/utils";

interface InputErrorProps {
   message?: string;
   className?: string;
}

const InputError = ({ message, className }: InputErrorProps) => {
   return (
      <p className={cn('text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-1', className)}>
         {message}
      </p>
   );
};

export default InputError;