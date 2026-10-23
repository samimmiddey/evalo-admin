"use client";

import { useEffect, useState } from "react";

interface FetchResult<T> {
   isLoading: boolean;
   error: string | null;
   data: T | null;
   refetch: () => Promise<void>;
}

export const useFetch = <T>(
   fetcherFunction: () => Promise<T>,
   deps: unknown[] = []
): FetchResult<T> => {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [data, setData] = useState<T | null>(null);

   const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
         const res = await fetcherFunction();
         setData(res);
      } catch (error: unknown) {
         if (error instanceof Error) {
            setError(error.message);
         } else {
            setError("An unknown error occurred");
         }
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, deps);

   return { isLoading, error, data, refetch: fetchData };
};