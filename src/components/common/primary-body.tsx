import { cn } from '@/lib/utils';

interface PrimaryBodyProps {
   text: string;
   className?: string;
}

const PrimaryBody = ({ text, className }: PrimaryBodyProps) => {
   return (
      <p className={cn('text-sm lg:text-base text-zinc-400 leading-relaxed', className)}>
         {text}
      </p>
   );
};

export default PrimaryBody;