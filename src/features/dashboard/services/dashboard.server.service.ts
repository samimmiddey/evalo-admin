import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import {
   DashboardMetrics,
   DashboardMetricsFilter,
   ExpertiseDemandItem,
   InterviewVolumeTrendItem,
   PaginatedRecentSessions,
   RecentSessionItem,
   RecentSessionsFilter,
} from "../types/dashboard.types";
import { getAuthenticatedUser } from "@/services/global.server.service";
import { eachDayOfInterval, endOfDay, format, startOfDay, subDays } from "date-fns";
import { InterviewExpertise } from "@/generated/prisma/enums";

// Get dashboard overview metrics
export const getAdminOverviewMetrics = async (filters: DashboardMetricsFilter): Promise<DashboardMetrics> => {
   try {
      await getAuthenticatedUser();

      const normalizedEndDate = filters.endDate ? endOfDay(filters.endDate) : undefined;

      const dateFilter =
         filters?.startDate || normalizedEndDate
            ? {
               createdAt: {
                  ...(filters?.startDate ? { gte: filters.startDate } : {}),
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
         // Platform fees and disbursed payouts (current period)
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

         // Previous platform fees (for % growth)
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

         // Completed sessions
         db.booking.count({
            where: {
               status: "COMPLETED",
               ...dateFilter,
            },
         }),

         // Total sessions (for completion rate)
         db.booking.count({
            where: {
               ...dateFilter,
            },
         }),

         // Total active subscriptions
         db.subscription.count({
            where: {
               status: "ACTIVE",
            },
         }),

         // New subscriptions in period
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

// Get in-demand expertise metrics
export const getExpertiseDemandMetrics = async (
   filters: DashboardMetricsFilter
): Promise<ExpertiseDemandItem[]> => {
   try {
      await getAuthenticatedUser();

      const normalizedEndDate = filters.endDate ? endOfDay(filters.endDate) : undefined;

      const dateFilter =
         filters?.startDate || normalizedEndDate
            ? {
               createdAt: {
                  ...(filters?.startDate ? { gte: filters.startDate } : {}),
                  ...(normalizedEndDate ? { lte: normalizedEndDate } : {}),
               },
            }
            : {};

      const bookings = await db.booking.findMany({
         where: {
            ...dateFilter,
            status: { not: "CANCELLED" },
         },
         select: {
            interviewer: {
               select: {
                  expertise: true,
               },
            },
         },
      });

      const counts: Record<InterviewExpertise, number> = Object.values(InterviewExpertise).reduce(
         (acc, domain) => ({ ...acc, [domain]: 0 }),
         {} as Record<InterviewExpertise, number>
      );
      let totalTags = 0;

      for (const booking of bookings) {
         for (const domain of booking.interviewer.expertise) {
            counts[domain] += 1;
            totalTags += 1;
         }
      }

      return Object.entries(counts).map(([domain, count]) => ({
         label: domain as InterviewExpertise,
         count,
         percentage: totalTags > 0 ? Math.round((count / totalTags) * 100) : 0,
      }));
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch in-demand expertise metrics",
      });
   }
};

// Get interview volume trends
export const getInterviewVolumeTrends = async (
   filters: DashboardMetricsFilter
): Promise<InterviewVolumeTrendItem[]> => {
   try {
      await getAuthenticatedUser();

      const normalizedEndDate = filters.endDate ? endOfDay(filters.endDate) : endOfDay(new Date());
      let normalizedStartDate = filters.startDate ? startOfDay(filters.startDate) : undefined;

      // If no start date is provided (e.g. All Time), look up earliest booking or default to last 30 days
      if (!normalizedStartDate) {
         const earliestBooking = await db.booking.findFirst({
            orderBy: { createdAt: "asc" },
            select: { createdAt: true },
         });
         normalizedStartDate = earliestBooking
            ? startOfDay(earliestBooking.createdAt)
            : startOfDay(subDays(normalizedEndDate, 29));
      }

      // Safeguard: Ensure start date doesn't exceed end date
      if (normalizedStartDate > normalizedEndDate) {
         normalizedStartDate = startOfDay(normalizedEndDate);
      }

      const bookings = await db.booking.findMany({
         where: {
            createdAt: {
               gte: normalizedStartDate,
               lte: normalizedEndDate,
            },
         },
         select: {
            createdAt: true,
            status: true,
         },
      });

      // Generate all calendar days within the interval
      const days = eachDayOfInterval({
         start: normalizedStartDate,
         end: normalizedEndDate,
      });

      // Initialize map with all dates at 0 so continuous trendline has no gaps
      const trendMap = new Map<
         string,
         { completed: number; scheduled: number; cancelled: number; total: number; }
      >();

      for (const day of days) {
         const dateKey = format(day, "yyyy-MM-dd");
         trendMap.set(dateKey, {
            completed: 0,
            scheduled: 0,
            cancelled: 0,
            total: 0,
         });
      }

      // Aggregate counts from database bookings
      for (const booking of bookings) {
         const dateKey = format(booking.createdAt, "yyyy-MM-dd");
         const dayStats = trendMap.get(dateKey);

         if (dayStats) {
            dayStats.total += 1;
            if (booking.status === "COMPLETED") {
               dayStats.completed += 1;
            } else if (booking.status === "SCHEDULED") {
               dayStats.scheduled += 1;
            } else if (booking.status === "CANCELLED") {
               dayStats.cancelled += 1;
            }
         }
      }

      return Array.from(trendMap.entries()).map(([date, stats]) => ({
         date,
         completed: stats.completed,
         scheduled: stats.scheduled,
         cancelled: stats.cancelled,
         total: stats.total,
      }));
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch interview volume trends",
      });
   }
};

// Get recent sessions
export const getRecentSessions = async (
   filters?: RecentSessionsFilter
): Promise<PaginatedRecentSessions> => {
   try {
      await getAuthenticatedUser();

      const page = Math.max(1, filters?.page ?? 1);
      const pageSize = Math.max(1, Math.min(100, filters?.pageSize ?? 10));
      const skip = (page - 1) * pageSize;

      const normalizedEndDate = filters?.endDate ? endOfDay(filters.endDate) : undefined;

      const dateFilter =
         filters?.startDate || normalizedEndDate
            ? {
               createdAt: {
                  ...(filters?.startDate ? { gte: filters.startDate } : {}),
                  ...(normalizedEndDate ? { lte: normalizedEndDate } : {}),
               },
            }
            : {};

      const [totalCount, bookings] = await Promise.all([
         db.booking.count({
            where: {
               ...dateFilter,
            },
         }),
         db.booking.findMany({
            where: {
               ...dateFilter,
            },
            skip,
            take: pageSize,
            orderBy: {
               createdAt: "desc",
            },
            select: {
               id: true,
               status: true,
               startTime: true,
               candidate: {
                  select: {
                     firstName: true,
                     lastName: true,
                     email: true,
                     imageUrl: true,
                     credits: true,
                  },
               },
            },
         }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      const data: RecentSessionItem[] = bookings.map((booking) => {
         const name = [booking.candidate.firstName, booking.candidate.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() || "Unknown User";

         return {
            id: booking.id,
            name,
            email: booking.candidate.email,
            image: booking.candidate.imageUrl,
            dateTime: booking.startTime,
            status: booking.status,
            userCredit: booking.candidate.credits,
         };
      });

      return {
         data,
         page,
         pageSize,
         totalCount,
         totalPages,
         hasNextPage: page < totalPages,
         hasPrevPage: page > 1,
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch recent sessions",
      });
   }
};