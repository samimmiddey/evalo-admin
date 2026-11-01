import { getInterviewVolumeTrends } from "@/features/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const startParam = searchParams.get('startDate');
      const endParam = searchParams.get('endDate');

      const startDate = startParam ? new Date(startParam) : undefined;
      const endDate = endParam ? new Date(endParam) : undefined;

      // Validation check
      if (startDate && isNaN(startDate.getTime())) {
         throw new ValidationError("Invalid startDate parameter");
      }
      if (endDate && isNaN(endDate.getTime())) {
         throw new ValidationError("Invalid endDate parameter");
      }

      const res = await getInterviewVolumeTrends({ startDate, endDate });

      return apiResponse({
         statusCode: 200,
         data: res
      });
   } catch (error: unknown) {
      apiErrorResponse({ error });
   }
}