import { api } from "@/lib/api";
import { DashboardMetrics, DashboardMetricsFilter, DashboardMetricsResponse } from "../types/dashboard.types";
import { GET_DASHBOARD_METRICS } from "@/constants/query-urls";
import { apiError } from "@/lib/api-error";

export const getAdminOverviewMetrics = async (params: DashboardMetricsFilter): Promise<DashboardMetrics> => {
   try {
      const { startDate, endDate } = params;

      const searchParams = new URLSearchParams();

      if (startDate) searchParams.set('startDate', startDate.toISOString());
      if (endDate) searchParams.set('endDate', endDate.toISOString());

      const res = await api.get(`${GET_DASHBOARD_METRICS}?${searchParams.toString()}`).json<DashboardMetricsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to fetch dashboard overview metrics"
      });
   }
};