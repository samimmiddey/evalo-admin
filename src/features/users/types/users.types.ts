import { BaseResponse } from "@/types/api.types";
import { UserRole, UserStatus } from "@/generated/prisma/enums";

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


