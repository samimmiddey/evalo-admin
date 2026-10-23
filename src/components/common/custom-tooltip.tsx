import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

interface CustomTooltipProps {
   trigger: React.ReactNode;
   content: React.ReactNode;
}

const CustomTooltip = ({ trigger, content }: CustomTooltipProps) => {
   return (
      <Tooltip>
         <TooltipTrigger>
            {trigger}
         </TooltipTrigger>
         <TooltipContent className='font-medium z-99999'>
            {content}
         </TooltipContent>
      </Tooltip>
   );
};

export default CustomTooltip;