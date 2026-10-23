import { ViewType } from '@/types/ui.types';
import { useState } from 'react';

const useView = (initialView: ViewType = 'grid') => {
   const [view, setView] = useState<ViewType>(initialView);

   return {
      view,
      setView
   };
};

export default useView;