import { getAdminOverviewMetrics } from "@/features/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const startParam = (searchParams.get('startDate'));
      const endParam = searchParams.get('endDate');

      const startDate = startParam ? new Date(startParam) : undefined;
      const endDate = endParam ? new Date(endParam) : undefined;

      // Validate data
      if (startDate && isNaN(startDate.getTime())) {
         throw new ValidationError("Invalid startDate parameter");
      }
      if (endDate && isNaN(endDate.getTime())) {
         throw new ValidationError("Invalid endDate parameter");
      }

      const stats = await getAdminOverviewMetrics({ startDate, endDate });

      return apiResponse({
         statusCode: 200,
         data: stats
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}