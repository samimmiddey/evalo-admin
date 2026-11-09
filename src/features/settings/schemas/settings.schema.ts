import { z } from "zod";

export const settingsSchema = z.object({
   creditPayoutRate: z
      .number()
      .min(0, { message: "Credit payout rate cannot be negative" }),
   platformFeePercent: z
      .number()
      .min(0, { message: "Platform fee cannot be less than 0%" })
      .max(100, { message: "Platform fee cannot exceed 100%" }),
   minPayoutCredits: z
      .number()
      .int({ message: "Must be a whole number" })
      .min(1, { message: "Minimum payout credits must be at least 1" }),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;
