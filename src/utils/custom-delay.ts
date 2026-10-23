export const customDelay = (ms: number) => {
   return new Promise(
      (resolve) => setTimeout(resolve, ms)
   );
}