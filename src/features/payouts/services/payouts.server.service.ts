import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { getAuthenticatedUser } from "@/services/global.server.service";
import { Prisma } from "@/generated/prisma/client";
import { PayoutStatus } from "@/generated/prisma/enums";
import { apiCashfree } from "@/lib/api-cashfree";
import { AppError, ConflictError, NotFoundError, ValidationError } from "@/lib/app-error";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import {
   PaginatedPayouts,
   PayoutInterviewer,
   PayoutItem,
   PayoutsFilter,
   ExportPayoutsCsv,
   ExportPayoutsCsvFilter,
   ApprovePayoutParams,
   ApprovePayoutResult,
   CashfreeCashgramResponse,
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

export const exportPayoutsCsv = async (filters?: ExportPayoutsCsvFilter): Promise<ExportPayoutsCsv> => {
   try {
      await getAuthenticatedUser();

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

      const payouts = await db.payout.findMany({
         where,
         orderBy: {
            createdAt: "desc",
         },
         include: {
            interviewer: {
               select: {
                  firstName: true,
                  lastName: true,
                  email: true,
               },
            },
         },
      });

      const headers = [
         "Payout ID",
         "Interviewer Name",
         "Interviewer Email",
         "Credits",
         "Platform Fee",
         "Net Amount",
         "Status",
         "Admin Note",
         "Requested At",
         "Processed At",
      ];

      const escapeCsvField = (field?: string | number | boolean | null): string => {
         if (field === null || field === undefined) return '""';
         const str = String(field);
         return `"${str.replace(/"/g, '""')}"`;
      };

      const rows = payouts.map((payout) => {
         const interviewerName =
            [payout.interviewer.firstName, payout.interviewer.lastName].filter(Boolean).join(" ").trim() ||
            "Unknown User";

         return [
            escapeCsvField(payout.id),
            escapeCsvField(interviewerName),
            escapeCsvField(payout.interviewer.email),
            escapeCsvField(payout.credits),
            escapeCsvField(payout.platformFee),
            escapeCsvField(payout.netAmount),
            escapeCsvField(payout.status),
            escapeCsvField(payout.adminNote ?? ""),
            escapeCsvField(payout.createdAt.toISOString()),
            escapeCsvField(payout.processedAt ? payout.processedAt.toISOString() : ""),
         ].join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      const filename = `payouts-export-${new Date().toISOString().split("T")[0]}.csv`;

      return {
         csv,
         filename,
         totalRecords: payouts.length,
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to export payouts to CSV",
      });
   }
};

export const approvePayout = async ({
   payoutId,
}: ApprovePayoutParams): Promise<ApprovePayoutResult> => {
   try {
      const admin = await getAuthenticatedUser();

      const payout = await db.payout.findUnique({
         where: { id: payoutId },
         include: {
            interviewer: {
               select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                  imageUrl: true,
               },
            },
         },
      });

      if (!payout) {
         throw new NotFoundError("Payout request not found");
      }

      if (payout.status !== PayoutStatus.PROCESSING) {
         throw new ConflictError(
            `Payout cannot be approved because it is already marked as ${payout.status}`
         );
      }

      const sanitizedPhone = (payout.interviewer.phone || "").replace(/\D/g, "").slice(-10);
      if (sanitizedPhone.length !== 10) {
         throw new ValidationError(
            "Interviewer must have a valid 10-digit phone number to receive a Cashgram payout"
         );
      }

      const rawName =
         [payout.interviewer.firstName, payout.interviewer.lastName].filter(Boolean).join(" ").trim() ||
         "Interviewer";
      const sanitizedName = rawName.replace(/[^a-zA-Z\s]/g, "").trim().slice(0, 100) || "Interviewer";

      const linkExpiry = format(addDays(new Date(), 7), "yyyy/MM/dd");
      const cashgramId = `cg_${payout.id.replace(/-/g, "").slice(0, 32)}`;

      const response = await apiCashfree.post("payout/v1/createCashgram", {
         json: {
            cashgramId,
            amount: Number(payout.netAmount.toFixed(2)),
            name: sanitizedName,
            phone: sanitizedPhone,
            email: payout.interviewer.email,
            linkExpiry,
            remarks: "Payout approval",
            notifyCustomer: 1,
         },
      });

      const result = await response.json<CashfreeCashgramResponse>();

      if (result.status !== "SUCCESS" || (!result.data?.cashgramUrl && !result.data?.paymentUrl)) {
         throw new AppError(
            result.message || "Failed to create Cashfree Cashgram",
            Number(result.subCode) || 400
         );
      }

      const cashgramUrl = result.data.cashgramUrl || result.data.paymentUrl || "";

      const updatedPayout = await db.payout.update({
         where: { id: payoutId },
         data: {
            status: PayoutStatus.APPROVED,
            processedBy: admin.id,
            cashgramId,
            cashgramUrl,
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
      });

      return {
         success: true,
         status: updatedPayout.status
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to approve payout and generate Cashgram",
      });
   }
};

