import { BaseResponse } from "@/types/api.types";
import {
   BookingStatus,
   CompletionReason,
} from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

export interface SessionParticipant {
   id: string;
   name: string;
   email: string;
   image: string | null;
}

export interface SessionItem {
   id: string;
   startTime: Date;
   endTime: Date;
   status: BookingStatus;
   completionReason: CompletionReason | null;
   creditsCharged: number;
   isRefunded: boolean;
   createdAt: Date;
   candidate: SessionParticipant;
   interviewer: SessionParticipant;
}

export interface SessionsFilter {
   search?: string;
   status?: BookingStatus;
   completionReason?: CompletionReason;
   startDate?: Date;
   endDate?: Date;
   page?: number;
   pageSize?: number;
}

export interface Sessions {
   data: SessionItem[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type SessionsResponse = BaseResponse<Sessions>;

export type BookingWithParties = Prisma.BookingGetPayload<{
   include: { candidate: true; interviewer: true; };
}>;

export interface CancelBooking {
   success: boolean;
}

export type CancelBookingResponse = BaseResponse<null>;

export interface IssueRefundParams {
   bookingId: string;
   adminNote: string;
}

export interface IssueRefund {
   success: boolean;
}

export type IssueRefundResponse = BaseResponse<null>;

export interface ExportSessionsCsvFilter {
   search?: string;
   status?: BookingStatus;
   completionReason?: CompletionReason;
   startDate?: Date;
   endDate?: Date;
}

export interface ExportSessionsCsv {
   csv: string;
   filename: string;
   totalRecords: number;
}

export type ExportSessionsCsvResponse = BaseResponse<ExportSessionsCsv>;
