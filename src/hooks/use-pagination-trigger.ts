import { useEffect, useRef } from 'react';

interface UsePaginationTriggerOptions {
   onIntersect: () => void;
   enabled?: boolean;
   isFetching?: boolean;
   rootMargin?: string;
   threshold?: number;
}

export function usePaginationTrigger({
   onIntersect,
   enabled = true,
   isFetching = false,
   rootMargin = '200px',
   threshold = 0,
}: UsePaginationTriggerOptions) {
   const sentinelRef = useRef<HTMLDivElement | null>(null);
   const onIntersectRef = useRef(onIntersect);

   // Keep the latest callback without re-creating the observer every render
   useEffect(() => {
      onIntersectRef.current = onIntersect;
   }, [onIntersect]);

   useEffect(() => {
      const node = sentinelRef.current;
      if (!node || !enabled || isFetching) return;

      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0]?.isIntersecting) {
               onIntersectRef.current();
            }
         },
         { rootMargin, threshold }
      );

      observer.observe(node);

      return () => {
         observer.disconnect();
      };
   }, [enabled, isFetching, rootMargin, threshold]);

   return { ref: sentinelRef };
}