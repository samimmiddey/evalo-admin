import { api } from "@/lib/api";
import {
   DashboardMetrics,
   DashboardMetricsFilter,
   DashboardMetricsResponse,
   ExpertiseDemandItem,
   ExpertiseDemandResponse,
   InterviewVolumeTrendItem,
   InterviewVolumeTrendsResponse,
   PaginatedRecentSessions,
   RecentSessionsFilter,
   RecentSessionsResponse,
} from "../types/dashboard.types";
import {
   GET_DASHBOARD_METRICS,
   GET_EXPERTISE_METRICS,
   GET_INTERVIEW_TRENDS,
   GET_RECENT_SESSIONS,
} from "@/constants/query-urls";
import { apiError } from "@/lib/api-error";

// Get admin dashboard metrics
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

// Get in-demand expertise metrics
export const getExpertiseDemandMetrics = async (params: DashboardMetricsFilter): Promise<ExpertiseDemandItem[]> => {
   try {
      const { startDate, endDate } = params;

      const searchParams = new URLSearchParams();

      if (startDate) searchParams.set('startDate', startDate.toISOString());
      if (endDate) searchParams.set('endDate', endDate.toISOString());

      const res = await api.get(`${GET_EXPERTISE_METRICS}?${searchParams.toString()}`).json<ExpertiseDemandResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to fetch in-demand expertise metrics'
      });
   }
};

// Get interview volume trends
export const getInterviewVolumeTrends = async (params: DashboardMetricsFilter): Promise<InterviewVolumeTrendItem[]> => {
   try {
      const { startDate, endDate } = params;

      const searchParams = new URLSearchParams();

      if (startDate) searchParams.set('startDate', startDate.toISOString());
      if (endDate) searchParams.set('endDate', endDate.toISOString());

      const res = await api.get(`${GET_INTERVIEW_TRENDS}?${searchParams.toString()}`).json<InterviewVolumeTrendsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to fetch interview volume trends'
      });
   }
};

// Get recent sessions
export const getRecentSessions = async (
   params: RecentSessionsFilter
): Promise<PaginatedRecentSessions> => {
   try {
      const { startDate, endDate, page, pageSize } = params;

      const searchParams = new URLSearchParams();

      if (startDate) searchParams.set('startDate', startDate.toISOString());
      if (endDate) searchParams.set('endDate', endDate.toISOString());
      if (page) searchParams.set('page', page.toString());
      if (pageSize) searchParams.set('pageSize', pageSize.toString());

      const res = await api
         .get(`${GET_RECENT_SESSIONS}?${searchParams.toString()}`)
         .json<RecentSessionsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to fetch recent sessions',
      });
   }
};