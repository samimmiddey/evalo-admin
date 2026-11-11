import { exportPayoutsCsv } from "@/features/payouts/services/payouts.server.service";
import { PayoutStatus } from "@/generated/prisma/enums";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const startParam = searchParams.get("startDate");
      const endParam = searchParams.get("endDate");

      const startDate = startParam ? new Date(startParam) : undefined;
      const endDate = endParam ? new Date(endParam) : undefined;

      const search = searchParams.get("search") || undefined;
      const status = (searchParams.get("status") as PayoutStatus) || undefined;

      // startDate and endDate parameter validation check
      if (startDate && isNaN(startDate.getTime())) throw new ValidationError("Invalid startDate parameter");
      if (endDate && isNaN(endDate.getTime())) throw new ValidationError("Invalid endDate parameter");

      const res = await exportPayoutsCsv({
         startDate,
         endDate,
         search,
         status,
      });

      return apiResponse({
         statusCode: 200,
         data: res,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}

