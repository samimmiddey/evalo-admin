import {
   getPlatformConfig,
   updatePlatformConfig,
} from "@/features/settings/services/settings.server.service";
import { UpdatePlatformConfigInput } from "@/features/settings/types/settings.types";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { NextRequest } from "next/server";

export async function GET() {
   try {
      const config = await getPlatformConfig();

      return apiResponse({
         statusCode: 200,
         data: config,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json()) as Partial<UpdatePlatformConfigInput>;

      if (!body || typeof body !== "object") {
         throw new ValidationError("Invalid request body");
      }

      const updated = await updatePlatformConfig({
         creditPayoutRate: Number(body.creditPayoutRate),
         platformFeePercent: Number(body.platformFeePercent),
         minPayoutCredits: Number(body.minPayoutCredits),
      });

      return apiResponse({
         statusCode: 200,
         data: updated,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
