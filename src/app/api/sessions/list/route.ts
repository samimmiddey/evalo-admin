import { getSessions } from "@/features/sessions/services/sessions.server.service";
import { BookingStatus, CompletionReason } from "@/generated/prisma/enums";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const page = Number(searchParams.get('page')) || undefined;
      const pageSize = Number(searchParams.get('pageSize')) || undefined;

      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');

      const startDate = startDateParam ? new Date(startDateParam) : undefined;
      const endDate = endDateParam ? new Date(endDateParam) : undefined;

      const search = searchParams.get('search') || undefined;
      const status = searchParams.get('status') as BookingStatus || undefined;
      const completionReason = searchParams.get('completionReason') as CompletionReason || undefined;

      // Page and pageSize parameter validation check
      if (page && isNaN(page)) throw new ValidationError("Invalid page parameter");
      if (pageSize && isNaN(pageSize)) throw new ValidationError("Invalid pageSize parameter");

      // startDate and endDate parameter validation check
      if (startDate && isNaN(startDate.getTime())) throw new ValidationError("Invalid startDate parameter");
      if (endDate && isNaN(endDate.getTime())) throw new ValidationError("Invalid endDate parameter");

      const res = await getSessions({
         page,
         pageSize,
         search,
         status,
         completionReason,
         startDate,
         endDate
      });

      return apiResponse({
         statusCode: 200,
         data: res
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}