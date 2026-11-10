import { issueRefund } from "@/features/sessions/services/sessions.server.service";
import { IssueRefundParams } from "@/features/sessions/types/sessions.types";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json().catch(() => null)) as Partial<IssueRefundParams> | null;
      const { searchParams } = new URL(request.url);

      const bookingId = body?.bookingId ?? searchParams.get("bookingId");
      const adminNote = body?.adminNote ?? searchParams.get("adminNote");

      if (!bookingId || typeof bookingId !== "string") {
         throw new ValidationError("Booking ID not found");
      }

      if (!adminNote || typeof adminNote !== "string" || !adminNote.trim()) {
         throw new ValidationError("An admin note/reason is required to issue a refund");
      }

      await issueRefund({
         bookingId,
         adminNote: adminNote.trim()
      });

      return apiResponse({
         statusCode: 200,
         data: null,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
