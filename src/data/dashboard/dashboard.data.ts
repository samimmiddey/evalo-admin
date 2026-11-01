import { LineSeriesConfig } from "@/components/common/charts/line-chart";
import { DashboardData } from "./dashboard.types";

export const dashboardData: DashboardData = {
   header: {
      title: "Dashboard Overview",
      description: "A comprehensive overview of platform revenue, interviews, and subscriber growth",
   },
   noData: {
      title: "No data found",
      body: "Currently there is no data to show. Please check later.",
   },
   statCards: {
      platformFees: "Platform Fees",
      disbursedPayouts: "Disbursed Payouts",
      totalInterviews: "Total Interviews",
      activeSubscriptions: "Active Subscriptions",
   },
   experienceMetrics: {
      title: "Most Requested Tech Domains",
      noData: "No interview data found for this period"
   },
   interviewTrends: {
      title: "Interview Volume Trends",
      noData: "No interview data found for this period",
   },
};

export const TREND_SERIES: LineSeriesConfig[] = [
   { dataKey: 'completed', name: 'Completed', color: '#10b981' },
   { dataKey: 'scheduled', name: 'Scheduled', color: '#8b5cf6' },
   { dataKey: 'cancelled', name: 'Cancelled', color: '#f43f5e' },
];
