"use client";

import { useEffect, useRef, useState } from "react";

interface PaginatedResponse<T> {
   data: T[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

interface UseInfiniteFetchResult<T> {
   data: T[];
   isLoading: boolean;
   isFetchingNextPage: boolean;
   error: string | null;
   hasNextPage: boolean;
   fetchNextPage: () => void;
   refetch: () => void;
}

export const useInfiniteFetch = <T>(
   fetcherFunction: (page: number) => Promise<PaginatedResponse<T>>,
   deps: unknown[] = []
): UseInfiniteFetchResult<T> => {
   const [data, setData] = useState<T[]>([]);
   const [page, setPage] = useState<number>(1);
   const [hasNextPage, setHasNextPage] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   // Guards against a slow page-1 response overwriting a newer query's results if deps change again before the first fetch resolves.
   const requestIdRef = useRef(0);

   const fetchPage = async (targetPage: number, isFirstPage: boolean) => {
      const requestId = requestIdRef.current;

      if (isFirstPage) {
         setIsLoading(true);
      } else {
         setIsFetchingNextPage(true);
      }
      setError(null);

      try {
         const res = await fetcherFunction(targetPage);

         // Stale response from a superseded query — ignore it
         if (requestId !== requestIdRef.current) return;

         setData((prev) => (isFirstPage ? res.data : [...prev, ...res.data]));
         setHasNextPage(res.hasNextPage);
         setPage(targetPage);
      } catch (err: unknown) {
         if (requestId !== requestIdRef.current) return;
         setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
         if (requestId === requestIdRef.current) {
            setIsLoading(false);
            setIsFetchingNextPage(false);
         }
      }
   };

   const resetAndFetchFirstPage = () => {
      requestIdRef.current += 1;
      setData([]);
      setPage(1);
      setHasNextPage(false);
      void fetchPage(1, true);
   };

   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetAndFetchFirstPage();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, deps);

   const fetchNextPage = () => {
      if (isLoading || isFetchingNextPage || !hasNextPage) return;
      void fetchPage(page + 1, false);
   };

   return {
      data,
      isLoading,
      isFetchingNextPage,
      error,
      hasNextPage,
      fetchNextPage,
      refetch: resetAndFetchFirstPage,
   };
};