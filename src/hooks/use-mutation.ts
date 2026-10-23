"use client";

import { useState } from "react";

interface MutationResult<T, Args extends unknown[]> {
   isPending: boolean;
   error: string | null;
   data: T | null;
   mutate: (...args: Args) => Promise<T | undefined>;
}

export const useMutation = <T, Args extends unknown[]>(
   mutationFunction: (...args: Args) => Promise<T>
): MutationResult<T, Args> => {
   const [isPending, setIsPending] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [data, setData] = useState<T | null>(null);

   const mutate = async (...args: Args): Promise<T | undefined> => {
      setIsPending(true);
      setError(null);
      setData(null);
      try {
         const res = await mutationFunction(...args);
         setData(res);
         return res;
      } catch (error: unknown) {
         if (error instanceof Error) {
            setError(error.message);
         } else {
            setError("An unknown error occurred");
         }
         return undefined;
      } finally {
         setIsPending(false);
      }
   };

   return { isPending, error, data, mutate };
};