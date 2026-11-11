import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { getAuthenticatedUser } from "@/services/global.server.service";
import { Prisma } from "@/generated/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import {
   PaginatedPayouts,
   PayoutInterviewer,
   PayoutItem,
   PayoutsFilter,
} from "../types/payouts.types";

const formatInterviewer = (user: {
   id: string;
   firstName: string | null;
   lastName: string | null;
   email: string;
   imageUrl: string | null;
}): PayoutInterviewer => {
   const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      "Unknown User";

   return {
      id: user.id,
      name,
      email: user.email,
      image: user.imageUrl,
   };
};

export const getPayouts = async (
   filters?: PayoutsFilter
): Promise<PaginatedPayouts> => {
   try {
      await getAuthenticatedUser();

      const page = Math.max(1, filters?.page ?? 1);
      const pageSize = Math.max(1, Math.min(100, filters?.pageSize ?? 10));
      const skip = (page - 1) * pageSize;

      const normalizedStartDate = filters?.startDate
         ? startOfDay(filters.startDate)
         : undefined;
      const normalizedEndDate = filters?.endDate
         ? endOfDay(filters.endDate)
         : undefined;

      const where: Prisma.PayoutWhereInput = {
         ...(filters?.status ? { status: filters.status } : {}),
         ...(normalizedStartDate || normalizedEndDate
            ? {
               createdAt: {
                  ...(normalizedStartDate ? { gte: normalizedStartDate } : {}),
                  ...(normalizedEndDate ? { lte: normalizedEndDate } : {}),
               },
            }
            : {}),
         ...(filters?.search
            ? {
               OR: [
                  {
                     id: {
                        contains: filters.search.trim(),
                        mode: "insensitive",
                     },
                  },
                  {
                     interviewer: {
                        firstName: {
                           contains: filters.search.trim(),
                           mode: "insensitive",
                        },
                     },
                  },
                  {
                     interviewer: {
                        lastName: {
                           contains: filters.search.trim(),
                           mode: "insensitive",
                        },
                     },
                  },
                  {
                     interviewer: {
                        email: {
                           contains: filters.search.trim(),
                           mode: "insensitive",
                        },
                     },
                  },
               ],
            }
            : {}),
      };

      const [totalCount, payouts] = await Promise.all([
         db.payout.count({ where }),
         db.payout.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: {
               createdAt: "desc",
            },
            include: {
               interviewer: {
                  select: {
                     id: true,
                     firstName: true,
                     lastName: true,
                     email: true,
                     imageUrl: true,
                  },
               },
            },
         }),
      ]);

      const mappedPayouts: PayoutItem[] = payouts.map((payout) => ({
         id: payout.id,
         interviewer: formatInterviewer(payout.interviewer),
         credits: payout.credits,
         platformFee: payout.platformFee,
         netAmount: payout.netAmount,
         status: payout.status,
         adminNote: payout.adminNote,
         createdAt: payout.createdAt,
         processedAt: payout.processedAt,
      }));

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      return {
         data: mappedPayouts,
         page,
         pageSize,
         totalCount,
         totalPages,
         hasNextPage: page < totalPages,
         hasPrevPage: page > 1,
      };
   } catch (error) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch payouts",
      });
   }
};

