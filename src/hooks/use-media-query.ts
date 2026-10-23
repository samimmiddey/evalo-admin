import { useState, useEffect } from 'react';

const useMediaQuery = (query: number) => {
   const [matches, setMatches] = useState<boolean | null>(null);

   useEffect(() => {
      const handleResize = () => {
         setMatches(window.innerWidth < query);
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
   }, [query]);

   return matches;
};

export default useMediaQuery;