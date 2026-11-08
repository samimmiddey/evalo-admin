import { getUserDetails } from "@/features/users/services/users.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const userId = searchParams.get('userId');

      if (!userId) {
         throw new ValidationError("User ID is required");
      }

      const res = await getUserDetails(userId);

      return apiResponse({
         statusCode: 200,
         data: res,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}

