import { rejectPayout } from "@/features/payouts/services/payouts.server.service";
import { RejectPayoutParams } from "@/features/payouts/types/payouts.types";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json().catch(() => null)) as Partial<RejectPayoutParams> | null;
      const { searchParams } = new URL(request.url);

      const payoutId = body?.payoutId ?? searchParams.get("payoutId");
      const adminNote = body?.adminNote ?? searchParams.get("adminNote") ?? undefined;

      if (!payoutId || typeof payoutId !== "string") {
         throw new ValidationError("Payout ID is required");
      }

      const result = await rejectPayout({
         payoutId,
         adminNote,
      });

      return apiResponse({
         statusCode: 200,
         data: result,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}

