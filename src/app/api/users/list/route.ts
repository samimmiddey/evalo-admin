import { getUsers } from "@/features/users/services/users.server.service";
import { UserRole } from "@/generated/prisma/enums";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const page = Number(searchParams.get('page')) || undefined;
      const pageSize = Number(searchParams.get('pageSize')) || undefined;

      const startParam = searchParams.get('startDate');
      const endParam = searchParams.get('endDate');

      const startDate = startParam ? new Date(startParam) : undefined;
      const endDate = endParam ? new Date(endParam) : undefined;

      const role = searchParams.get('role') as UserRole || undefined;
      const search = searchParams.get('search') || undefined;
      const status = searchParams.get('status') || undefined;

      // Page and pageSize parameter validation check
      if (page && isNaN(page)) throw new ValidationError("Invalid page parameter");
      if (pageSize && isNaN(pageSize)) throw new ValidationError("Invalid pageSize parameter");

      // startDate and endDate parameter validation check
      if (startDate && isNaN(startDate.getTime())) throw new ValidationError("Invalid startDate parameter");
      if (endDate && isNaN(endDate.getTime())) throw new ValidationError("Invalid endDate parameter");

      const res = await getUsers({
         page,
         pageSize,
         startDate,
         endDate,
         search,
         role,
         status
      });

      return apiResponse({
         statusCode: 200,
         data: res
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}