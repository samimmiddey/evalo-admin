import { getPayouts } from "@/features/payouts/services/payouts.server.service";
import { PayoutStatus } from "@/generated/prisma/enums";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const search = searchParams.get('search') || undefined;
      const status = searchParams.get('status') as PayoutStatus || undefined;

      const page = Number(searchParams.get('page')) || undefined;
      const pageSize = Number(searchParams.get('pageSize')) || undefined;

      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');

      const startDate = startDateParam ? new Date(startDateParam) : undefined;
      const endDate = endDateParam ? new Date(endDateParam) : undefined;

      // Validation check for page and pageSize
      if (page && isNaN(page)) throw new ValidationError('Invalid page parameter');
      if (pageSize && isNaN(pageSize)) throw new ValidationError('Invalid pageSize parameter');

      // Validaiton check for startDate and endDate
      if (startDate && isNaN(startDate.getTime())) throw new ValidationError('Invalid startDate parameter');
      if (endDate && isNaN(endDate.getTime())) throw new ValidationError('Invalid endDate parameter');

      const res = await getPayouts({
         search,
         status,
         startDate,
         endDate,
         page,
         pageSize
      });

      return apiResponse({
         statusCode: 200,
         data: res
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}