import { cn } from '@/lib/utils';

interface PrimaryTitleProps {
   text: string;
   className?: string;
}

const PrimaryTitle = ({
   text,
   className,
}: PrimaryTitleProps) => {
   return (
      <h2 className={cn('font-geist font-bold text-3xl lg:text-4xl 2xl:text-[42px] text-zinc-100', className)}>
         {text}
      </h2>
   );
};

export default PrimaryTitle;