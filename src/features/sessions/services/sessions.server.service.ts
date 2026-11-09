import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { getAuthenticatedUser } from "@/services/global.server.service";
import { Prisma } from "@/generated/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import {
   Sessions,
   SessionItem,
   SessionParticipant,
   SessionsFilter,
} from "../types/sessions.types";

const formatParticipant = (user: {
   id: string;
   firstName: string | null;
   lastName: string | null;
   email: string;
   imageUrl: string | null;
}): SessionParticipant => {
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

export const getSessions = async (
   filters?: SessionsFilter
): Promise<Sessions> => {
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

      const where: Prisma.BookingWhereInput = {
         ...(filters?.status ? { status: filters.status } : {}),
         ...(filters?.completionReason
            ? { completionReason: filters.completionReason }
            : {}),
         ...(normalizedStartDate || normalizedEndDate
            ? {
               startTime: {
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
                     candidate: {
                        firstName: {
                           contains: filters.search.trim(),
                           mode: "insensitive",
                        },
                     },
                  },
                  {
                     candidate: {
                        lastName: {
                           contains: filters.search.trim(),
                           mode: "insensitive",
                        },
                     },
                  },
                  {
                     candidate: {
                        email: {
                           contains: filters.search.trim(),
                           mode: "insensitive",
                        },
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

      const [totalCount, bookings] = await Promise.all([
         db.booking.count({ where }),
         db.booking.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: {
               startTime: "desc",
            },
            select: {
               id: true,
               startTime: true,
               endTime: true,
               status: true,
               completionReason: true,
               creditsCharged: true,
               isRefunded: true,
               createdAt: true,
               candidate: {
                  select: {
                     id: true,
                     firstName: true,
                     lastName: true,
                     email: true,
                     imageUrl: true,
                  },
               },
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

      const totalPages = Math.ceil(totalCount / pageSize);

      const data: SessionItem[] = bookings.map((booking) => ({
         id: booking.id,
         startTime: booking.startTime,
         endTime: booking.endTime,
         status: booking.status,
         completionReason: booking.completionReason,
         creditsCharged: booking.creditsCharged,
         isRefunded: booking.isRefunded,
         createdAt: booking.createdAt,
         candidate: formatParticipant(booking.candidate),
         interviewer: formatParticipant(booking.interviewer),
      }));

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
         fallbackMessage: "Failed to fetch sessions",
      });
   }
};
