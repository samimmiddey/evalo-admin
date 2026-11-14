import { BaseResponse } from "@/types/api.types";
import { PayoutStatus } from "@/generated/prisma/enums";

export interface PayoutInterviewer {
   id: string;
   name: string;
   email: string;
   image: string | null;
}

export interface PayoutItem {
   id: string;
   interviewer: PayoutInterviewer;
   credits: number;
   platformFee: number;
   netAmount: number;
   status: PayoutStatus;
   adminNote: string | null;
   createdAt: Date;
   processedAt: Date | null;
}

export interface PayoutsFilter {
   search?: string;
   status?: PayoutStatus;
   startDate?: Date;
   endDate?: Date;
   page?: number;
   pageSize?: number;
}

export interface PaginatedPayouts {
   data: PayoutItem[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type PayoutsResponse = BaseResponse<PaginatedPayouts>;

export interface ExportPayoutsCsvFilter {
   search?: string;
   status?: PayoutStatus;
   startDate?: Date;
   endDate?: Date;
}

export interface ExportPayoutsCsv {
   csv: string;
   filename: string;
   totalRecords: number;
}

export type ExportPayoutsCsvResponse = BaseResponse<ExportPayoutsCsv>;

export interface ApprovePayoutParams {
   payoutId: string;
}

export interface ApprovePayoutResult {
   success: boolean;
   status: PayoutStatus;
}

export type ApprovePayoutResponse = BaseResponse<ApprovePayoutResult>;

export interface CashfreeCashgramData {
   cashgramId?: string;
   cashgramUrl?: string;
   paymentUrl?: string;
   cashgramLink?: string;
}

export interface CashfreeCashgramResponse {
   status: string;
   subCode: string;
   message: string;
   data?: CashfreeCashgramData;
}

