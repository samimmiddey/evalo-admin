import { ArrowRight, Database } from 'lucide-react';
import { Button } from '../ui/button';
import SecondaryTitle from './secondary-title';
import PrimaryBody from './primary-body';
import Link from 'next/link';

interface EnhancedNoDataCardProps {
   title: string;
   body: string;
   showButton?: boolean;
   buttonText?: string;
   buttonLink?: string;
}

const EnhancedNoDataCard = ({ title, body, showButton = false, buttonText, buttonLink }: EnhancedNoDataCardProps) => {
   return (
      <div className="flex flex-col items-center justify-center text-center py-8 sm:py-9 2xl:py-10 px-6 bg-zinc-900/40 border border-dashed border-white/10 rounded-2xl relative overflow-hidden">

         {/* Icon */}
         <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900/80 border border-white/5 mb-6 shadow-inner">
            <Database className="w-6 h-6 text-zinc-500" />
         </div>

         {/* Title */}
         <SecondaryTitle
            text={title}
            className='mb-2'
         />

         {/* Body */}
         <PrimaryBody
            text={body}
            className='max-w-lg text-sm!'
         />

         {/* Button */}
         {
            showButton &&
            <Link href={buttonLink!} className='mt-6 mb-1'>
               <Button
                  className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 px-6 py-2.5 h-auto transition-all duration-200 group"
               >
                  {buttonText}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
               </Button>
            </Link>
         }
      </div>
   );
};

export default EnhancedNoDataCard;