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
};
