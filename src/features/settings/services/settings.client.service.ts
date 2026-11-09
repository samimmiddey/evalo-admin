"use client";

import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { GET_PLATFORM_CONFIG, UPDATE_PLATFORM_CONFIG } from "@/constants/query-urls";
import {
   PlatformConfigItem,
   PlatformConfigResponse,
   UpdatePlatformConfigInput,
   UpdatePlatformConfigResponse,
} from "../types/settings.types";

export const getPlatformConfig = async (): Promise<PlatformConfigItem> => {
   try {
      const res = await api.get(GET_PLATFORM_CONFIG).json<PlatformConfigResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to fetch platform settings",
      });
   }
};

export const updatePlatformConfig = async (
   data: UpdatePlatformConfigInput
): Promise<PlatformConfigItem> => {
   try {
      const res = await api
         .post(UPDATE_PLATFORM_CONFIG, { json: data })
         .json<UpdatePlatformConfigResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to update platform settings",
      });
   }
};

