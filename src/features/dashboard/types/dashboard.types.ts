import { BaseResponse } from "@/types/api.types";
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
