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
   BookingWithParties,
} from "../types/sessions.types";
import { ConflictError, ForbiddenError, NotFoundError } from "@/lib/app-error";
import { StreamClient } from "@stream-io/node-sdk";
import { GRACE_PERIOD_MS } from "@/constants/interview";

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

      const now = new Date();
      const expiredThreshold = new Date(now.getTime() - GRACE_PERIOD_MS);

      const where: Prisma.BookingWhereInput = {
         ...(filters?.status
            ? filters.status === "EXPIRED"
               ? {
                  OR: [
                     { status: "EXPIRED" },
                     {
                        status: "SCHEDULED",
                        endTime: { lt: expiredThreshold },
                     },
                  ],
               }
               : filters.status === "SCHEDULED"
                  ? {
                     status: "SCHEDULED",
                     endTime: { gte: expiredThreshold },
                  }
                  : { status: filters.status }
            : {}),
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
         status:
            booking.status === "SCHEDULED" && booking.endTime < expiredThreshold
               ? "EXPIRED"
               : booking.status,
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

// Cancel booking and refund credits
export const cancelBooking = async (bookingId: string): Promise<void> => {
   let booking: BookingWithParties;

   try {
      await getAuthenticatedUser();

      // Fetch booking + verify if the current user is allowed to cancel it
      const found = await db.booking.findUnique({
         where: {
            id: bookingId,
         },
         include: {
            candidate: true,
            interviewer: true,
         },
      });

      if (!found) {
         throw new NotFoundError("Booking not found");
      }

      booking = found;

      // Only scheduled bookings before slot end time can be cancelled
      if (booking.status !== "SCHEDULED" || new Date(booking.endTime) <= new Date()) {
         throw new ForbiddenError("Bookings cannot be cancelled after the session end time");
      }

      const now = new Date();
      await db.$transaction(async (tx) => {
         const { count } = await tx.booking.updateMany({
            where: {
               id: booking.id,
               status: "SCHEDULED",
               isRefunded: false,
               endTime: { gt: now }
            },
            data: {
               status: "CANCELLED",
               isRefunded: true
            },
         });

         if (count === 0) {
            throw new ConflictError("This booking cannot be cancelled or was already processed");
         }

         // Record transaction as refund
         await tx.creditTransaction.create({
            data: {
               userId: booking.candidateId,
               amount: booking.creditsCharged,
               type: "BOOKING_REFUND",
               bookingId: booking.id,
            },
         });

         // Add credits back to candidate's balance
         await tx.user.update({
            where: {
               id: booking.candidateId,
            },
            data: {
               credits: {
                  increment: booking.creditsCharged,
               },
            },
         });

         // If future availability slot exists, restore it to AVAILABLE
         const availability = await tx.availability.findFirst({
            where: {
               interviewerId: booking.interviewerId,
               startTime: booking.startTime,
               endTime: booking.endTime,
               status: 'BOOKED',
            },
         });

         if (availability && availability.startTime > new Date()) {
            await tx.availability.update({
               where: { id: availability.id },
               data: { status: 'AVAILABLE' },
            });
         }
      });
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to cancel booking. Please try again later."
      });
   }

   // Stream cleanup is separate from the database transaction
   if (booking.streamStatus === "READY" && booking.streamCallId) {
      try {
         const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
         const secretKey = process.env.STREAM_SECRET_KEY;

         if (!apiKey || !secretKey) {
            throw new Error("Missing Stream environment variables");
         }

         const streamClient = new StreamClient(apiKey, secretKey);

         const call = streamClient.video.call(
            "default",
            booking.streamCallId
         );

         await call.delete();
      } catch {
         // Booking is already cancelled in the DB. Stream cleanup failing
         // doesn't affect the outcome for the user — nothing to do here.
      }
   }
};
