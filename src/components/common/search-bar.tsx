import PrimaryBody from '@/components/common/primary-body';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
   value: string | undefined;
   setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
   showLabel?: boolean;
   label?: string;
   placeholder: string;
   inputClassName?: string;
}

const SearchBar = ({
   value, setValue,
   showLabel = true,
   label = 'Search',
   placeholder,
   inputClassName
}: SearchBarProps) => {
   return (
      <div className="flex flex-col gap-2.5 2xl:gap-3 w-full">
         {
            showLabel &&
            <PrimaryBody
               className="text-sm! font-medium! text-zinc-300! max-lg:hidden"
               text={label}
            />
         }
         <div className="relative w-full shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
               placeholder={placeholder}
               className={`w-full pl-10 text-sm! bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 ${inputClassName}`}
               value={value}
               onChange={setValue}
            />
         </div>
      </div>
   );
};

export default SearchBar;