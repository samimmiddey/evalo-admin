import { NextResponse } from "next/server";
import { AppError } from "./app-error";

type ApiResponseOptions<T> =
   | {
      statusCode: number;
      data: T;
      error?: never;
      message?: string;
   }
   | {
      statusCode: number;
      error?: unknown;
      data?: never;
      message: string;
   };

export const apiResponse = <T>({
   statusCode,
   data,
   error,
   message
}: ApiResponseOptions<T>) => {
   const errorMessage = error instanceof Error ? error.message : message;

   return NextResponse.json(
      {
         success: statusCode >= 200 && statusCode < 300,
         statusCode,
         ...(data !== undefined && { data }),
         ...(errorMessage !== undefined && { error: errorMessage }),
      },
      {
         status: statusCode,
      }
   );
};

// Handle AppError and return apiResponse
export const apiErrorResponse = ({ error }: { error: unknown; }) => {
   if (error instanceof AppError) {
      return apiResponse({
         statusCode: error.statusCode,
         message: error.message,
         error
      });
   }

   return apiResponse({
      statusCode: 500,
      message: "Internal Server Error",
      error
   });
};