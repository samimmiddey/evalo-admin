import { BaseResponse } from "@/types/api.types";
import { UserRole } from "@/generated/prisma/enums";
import { User } from "@/generated/prisma/client";

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

export type UserResponse = BaseResponse<User>;

