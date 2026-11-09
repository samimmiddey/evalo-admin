import { BaseResponse } from "@/types/api.types";

export interface PlatformConfigItem {
   id: string;
   creditPayoutRate: number;
   platformFeePercent: number;
   minPayoutCredits: number;
   currency: string;
   createdAt: Date;
   updatedAt: Date;
}

export type PlatformConfigResponse = BaseResponse<PlatformConfigItem>;

export interface UpdatePlatformConfigInput {
   creditPayoutRate: number;
   platformFeePercent: number;
   minPayoutCredits: number;
}

export type UpdatePlatformConfigResponse = BaseResponse<PlatformConfigItem>;

