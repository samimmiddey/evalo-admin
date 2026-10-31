import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { DashboardMetrics, DashboardMetricsFilter } from "../types/dashboard.types";
import { getAuthenticatedUser } from "@/services/global.server.service";
import { endOfDay } from "date-fns";

// Get Dashboard Overview Metrics
export const getAdminOverviewMetrics = async (filters: DashboardMetricsFilter): Promise<DashboardMetrics> => {
   try {
      await getAuthenticatedUser();

      const normalizedEndDate = filters.endDate ? endOfDay(filters.endDate) : undefined;

      const dateFilter =
         filters?.startDate || normalizedEndDate
            ? {
               createdAt: {
                  ...(filters.startDate ? { gte: filters.startDate } : {}),
                  ...(normalizedEndDate ? { lte: normalizedEndDate } : {}),
               },
            }
            : {};

      const payoutDateFilter =
         filters?.startDate || normalizedEndDate
            ? {
               processedAt: {
                  ...(filters.startDate ? { gte: filters.startDate } : {}),
                  ...(normalizedEndDate ? { lte: normalizedEndDate } : {}),
               },
            }
            : {};

      let prevDateFilter: { createdAt: { gte: Date; lt: Date; }; } | null = null;
      let prevPayoutDateFilter: { processedAt: { gte: Date; lt: Date; }; } | null = null;

      if (filters.startDate) {
         const end = normalizedEndDate || new Date();
         const duration = end.getTime() - filters.startDate.getTime();
         const prevStartDate = new Date(filters.startDate.getTime() - duration);
         const prevEndDate = filters.startDate;

         prevDateFilter = {
            createdAt: {
               gte: prevStartDate,
               lt: prevEndDate,
            },
         };

         prevPayoutDateFilter = {
            processedAt: {
               gte: prevStartDate,
               lt: prevEndDate,
            },
         };
      }

      const [
         payoutsAgg,
         prevPayoutsAgg,
         completedInterviews,
         totalInterviews,
         activeSubscriptions,
         newSubscriptions,
      ] = await Promise.all([
         // Platform Fees and Disbursed Payouts (current period)
         db.payout.aggregate({
            where: {
               status: "PROCESSED",
               ...payoutDateFilter,
            },
            _sum: {
               platformFee: true,
               netAmount: true,
            },
            _count: true,
         }),

         // Previous Platform Fees (for % growth)
         prevPayoutDateFilter
            ? db.payout.aggregate({
               where: {
                  status: "PROCESSED",
                  ...prevPayoutDateFilter,
               },
               _sum: {
                  platformFee: true,
               },
            })
            : Promise.resolve({ _sum: { platformFee: null } }),

         // Completed Sessions
         db.booking.count({
            where: {
               status: "COMPLETED",
               ...dateFilter,
            },
         }),

         // Total Sessions (for completion rate)
         db.booking.count({
            where: {
               ...dateFilter,
            },
         }),

         // Total Active Subscriptions
         db.subscription.count({
            where: {
               status: "ACTIVE",
            },
         }),

         // New Subscriptions in period
         db.subscription.count({
            where: {
               status: "ACTIVE",
               ...dateFilter,
            },
         }),
      ]);

      const platformFees = payoutsAgg._sum.platformFee ?? 0;
      const previousPlatformFees = prevPayoutsAgg._sum.platformFee ?? 0;
      const disbursedAmount = payoutsAgg._sum.netAmount ?? 0;
      const disbursedCount = payoutsAgg._count ?? 0;

      let platformFeesGrowth = 0;
      if (prevDateFilter) {
         if (previousPlatformFees > 0) {
            platformFeesGrowth = Math.round(
               ((platformFees - previousPlatformFees) / previousPlatformFees) * 100
            );
         } else if (platformFees > 0) {
            platformFeesGrowth = 100;
         }
      }

      const completionRate =
         totalInterviews > 0 ? Math.round((completedInterviews / totalInterviews) * 100) : 0;

      return {
         platformFees,
         previousPlatformFees,
         platformFeesGrowth,
         disbursedAmount,
         disbursedCount,
         completedInterviews,
         totalInterviews,
         completionRate,
         activeSubscriptions,
         newSubscriptions,
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch dashboard overview metrics",
      });
   }
};