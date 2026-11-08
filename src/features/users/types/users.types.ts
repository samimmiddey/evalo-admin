import { BaseResponse } from "@/types/api.types";
import { InterviewExpertise, SubscriptionStatus, UserRole, UserStatus } from "@/generated/prisma/enums";

export interface UsersFilter {
   search?: string;
   role?: UserRole;
   status?: string;
   startDate?: Date;
   endDate?: Date;
   page?: number;
   pageSize?: number;
}

export interface UserItem {
   id: string;
   clerkUserId: string;
   name: string;
   email: string;
   image: string | null;
   role: UserRole;
   status: "ACTIVE" | "BANNED";
   joined: Date;
   lastActive: Date | null;
   credits: number;
   hasActiveSession: boolean;
}

export interface PaginatedUsers {
   data: UserItem[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type UsersResponse = BaseResponse<PaginatedUsers>;

export interface ToggleUserStatus {
   id: string;
   success: boolean;
   status: UserStatus;
}

export type ToggleUserStatusResponse = BaseResponse<ToggleUserStatus>;

export interface SignOutUser {
   success: boolean;
   revokedSessionsCount: number;
}

export type SignOutUserResponse = BaseResponse<SignOutUser>;

export interface UserSubscriptionItem {
   id: string;
   cashfreeSubId: string;
   planSlug: string;
   status: SubscriptionStatus;
   currentPeriodStart: Date | null;
   currentPeriodEnd: Date | null;
   createdAt: Date;
}

export interface UserDetails {
   id: string;
   clerkUserId: string;
   firstName: string | null;
   lastName: string | null;
   name: string;
   email: string;
   phone: string | null;
   image: string | null;
   role: UserRole;
   status: UserStatus;
   joined: Date;
   updatedAt: Date;
   credits: number;
   creditBalance: number;
   currentPlan: string;
   creditsLastAllocatedAt: Date | null;
   bio: string | null;
   designation: string | null;
   company: string | null;
   experience: number | null;
   expertise: InterviewExpertise[];
   creditRate: number;
   averageRating: number | null;
   totalRatings: number;
   lastActive: Date | null;
   hasActiveSession: boolean;
   subscriptions: UserSubscriptionItem[];
   counts: {
      bookingsAsCandidate: number;
      bookingsAsInterviewer: number;
      transactions: number;
      payouts: number;
      availabilities: number;
   };
}

export type UserDetailsResponse = BaseResponse<UserDetails>;

export interface ExportUsersCsvFilter {
   search?: string;
   role?: UserRole;
   status?: string;
   startDate?: Date;
   endDate?: Date;
}

export interface ExportUsersCsv {
   csv: string;
   filename: string;
   totalRecords: number;
}

export type ExportUsersCsvResponse = BaseResponse<ExportUsersCsv>;



