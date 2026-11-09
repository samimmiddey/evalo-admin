import { cancelBooking } from "@/features/sessions/services/sessions.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const bookingId = searchParams.get('bookingId');

      if (!bookingId) {
         throw new ValidationError('Booking ID not found');
      }

      await cancelBooking(bookingId);

      return apiResponse({
         statusCode: 200,
         data: null
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}