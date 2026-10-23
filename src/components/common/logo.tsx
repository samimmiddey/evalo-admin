import { cn } from '@/lib/utils';

interface LogoProps {
   iconClassName?: string;
   textClassName?: string;
   containerClassName?: string;
}

const Logo = ({ iconClassName, textClassName, containerClassName }: LogoProps) => {
   return (
      <div className={cn("flex items-center gap-1 text-violet-400 select-none", containerClassName)}>
         <svg
            className={cn("h-7 w-7 shrink-0 mt-[1.5px]", iconClassName)}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
         >
            {/* Digital AI Brain hemispheres */}
            <rect x="7" y="5" width="4" height="2" rx="1" />
            <rect x="13" y="5" width="4" height="2" rx="1" />

            <rect x="4" y="8" width="7" height="2" rx="1" />
            <rect x="13" y="8" width="7" height="2" rx="1" />

            <rect x="5" y="11" width="6" height="2" rx="1" />
            <rect x="13" y="11" width="6" height="2" rx="1" />

            <rect x="7" y="14" width="4" height="2" rx="1" />
            <rect x="13" y="14" width="4" height="2" rx="1" />

            <rect x="9" y="17" width="2" height="2" rx="1" />
            <rect x="13" y="17" width="2" height="2" rx="1" />
         </svg>
         <h4 className={cn("font-geist font-bold text-xl text-zinc-100", textClassName)}>
            evalo
         </h4>
      </div>
   );
};

export default Logo;