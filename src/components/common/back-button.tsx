import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
   link: string;
   title: string;
   Icon: LucideIcon;
}

const BackButton = ({ link, title, Icon }: BackButtonProps) => {
   return (
      <Link
         href={link}
         className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
      >
         <Icon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
         {title}
      </Link>
   );
};

export default BackButton;