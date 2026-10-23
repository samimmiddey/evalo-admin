import { cn } from '@/lib/utils';

interface SecondaryTitleProps {
   text: string;
   className?: string;
}

const SecondaryTitle = ({
   text,
   className,
}: SecondaryTitleProps) => {
   return (
      <h2 className={cn('font-geist font-semibold text-zinc-100 text-lg 2xl:text-xl', className)}>
         {text}
      </h2>
   );
};

export default SecondaryTitle;