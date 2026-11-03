import { BaseResponse } from "@/types/api.types";
import { InterviewExpertise, BookingStatus } from "@/generated/prisma/enums";
import { LucideIcon } from "lucide-react";

export interface DashboardMetricsFilter {
   startDate?: Date;
   endDate?: Date;
}

export interface DashboardMetrics {
   platformFees: number;
   previousPlatformFees: number;
   platformFeesGrowth: number;
   disbursedAmount: number;
   disbursedCount: number;
   completedInterviews: number;
   totalInterviews: number;
   completionRate: number;
   activeSubscriptions: number;
   newSubscriptions: number;
}

export type DashboardMetricsResponse = BaseResponse<DashboardMetrics>;

export interface DashboardStatItem {
   title: string;
   value: string | number;
   subValue: string;
   icon: LucideIcon;
   iconStyle: string;
}

export interface ExpertiseDemandItem {
   label: InterviewExpertise;
   count: number;
   percentage: number;
}

export type ExpertiseDemandResponse = BaseResponse<ExpertiseDemandItem[]>;

export interface InterviewVolumeTrendItem {
   date: string;
   completed: number;
   scheduled: number;
   cancelled: number;
   total: number;
}

export type InterviewVolumeTrendsResponse = BaseResponse<InterviewVolumeTrendItem[]>;

export interface RecentSessionsFilter extends DashboardMetricsFilter {
   page?: number;
   pageSize?: number;
}

export interface RecentSessionItem {
   id: string;
   name: string;
   email: string;
   image: string | null;
   dateTime: Date;
   status: BookingStatus;
   userCredit: number;
}

export interface PaginatedRecentSessions {
   data: RecentSessionItem[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type RecentSessionsResponse = BaseResponse<PaginatedRecentSessions>;
