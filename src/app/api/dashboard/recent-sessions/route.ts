import { getRecentSessions } from "@/features/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const startParam = searchParams.get('startDate');
      const endParam = searchParams.get('endDate');
      const pageParam = searchParams.get('page');
      const pageSizeParam = searchParams.get('pageSize');

      const startDate = startParam ? new Date(startParam) : undefined;
      const endDate = endParam ? new Date(endParam) : undefined;
      const page = pageParam ? parseInt(pageParam, 10) : undefined;
      const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : undefined;

      // Validation check
      if (startDate && isNaN(startDate.getTime())) {
         throw new ValidationError("Invalid startDate parameter");
      }
      if (endDate && isNaN(endDate.getTime())) {
         throw new ValidationError("Invalid endDate parameter");
      }
      if (page !== undefined && (isNaN(page) || page < 1)) {
         throw new ValidationError("Invalid page parameter");
      }
      if (pageSize !== undefined && (isNaN(pageSize) || pageSize < 1 || pageSize > 100)) {
         throw new ValidationError("Invalid pageSize parameter");
      }

      const res = await getRecentSessions({
         startDate,
         endDate,
         page,
         pageSize,
      });

      return apiResponse({
         statusCode: 200,
         data: res,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}

