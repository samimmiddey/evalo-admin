"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
   return (
      <NextTopLoader
         color="#A78BFA"
         showSpinner={false}
         height={2}
         shadow="0 0 10px #A78BFA, 0 0 5px #A78BFA"
         zIndex={999999}
      />
   );
}