import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { getAuthenticatedUser } from "@/services/global.server.service";
import { PlatformConfigItem, UpdatePlatformConfigInput } from "../types/settings.types";
import { ValidationError } from "@/lib/app-error";

export const getPlatformConfig = async (): Promise<PlatformConfigItem> => {
   try {
      await getAuthenticatedUser();

      let config = await db.platformConfig.findFirst();

      if (!config) {
         config = await db.platformConfig.create({
            data: {
               creditPayoutRate: 50,
               platformFeePercent: 10,
               minPayoutCredits: 5,
               currency: "INR",
            },
         });
      }

      return config;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch platform configuration",
      });
   }
};

export const updatePlatformConfig = async (
   data: UpdatePlatformConfigInput
): Promise<PlatformConfigItem> => {
   try {
      await getAuthenticatedUser();

      if (typeof data.creditPayoutRate !== "number" || data.creditPayoutRate < 0) {
         throw new ValidationError("Credit payout rate must be a non-negative number");
      }

      if (
         typeof data.platformFeePercent !== "number" ||
         data.platformFeePercent < 0 ||
         data.platformFeePercent > 100
      ) {
         throw new ValidationError("Platform fee percent must be between 0 and 100");
      }

      if (
         typeof data.minPayoutCredits !== "number" ||
         data.minPayoutCredits < 1 ||
         !Number.isInteger(data.minPayoutCredits)
      ) {
         throw new ValidationError("Minimum payout credits must be an integer of at least 1");
      }

      const existing = await db.platformConfig.findFirst();

      if (existing) {
         const updated = await db.platformConfig.update({
            where: { id: existing.id },
            data: {
               creditPayoutRate: data.creditPayoutRate,
               platformFeePercent: data.platformFeePercent,
               minPayoutCredits: data.minPayoutCredits,
            },
         });

         return updated;
      }

      const created = await db.platformConfig.create({
         data: {
            creditPayoutRate: data.creditPayoutRate,
            platformFeePercent: data.platformFeePercent,
            minPayoutCredits: data.minPayoutCredits,
            currency: "INR",
         },
      });

      return created;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to update platform configuration",
      });
   }
};

