"use client";

import { apiError } from "@/lib/api-error";
import {
   ExportUsersCsv,
   ExportUsersCsvFilter,
   ExportUsersCsvResponse,
   PaginatedUsers,
   SignOutUser,
   SignOutUserResponse,
   ToggleUserStatus,
   ToggleUserStatusResponse,
   UserDetails,
   UserDetailsResponse,
   UsersFilter,
   UsersResponse,
} from "../types/users.types";
import { api } from "@/lib/api";
import {
   TOGGLE_USER_STATUS,
   GET_USERS,
   SIGN_OUT_USER,
   GET_USER_DETAILS,
   EXPORT_USERS_CSV,
} from "@/constants/query-urls";

export const getUsers = async (filters?: UsersFilter): Promise<PaginatedUsers> => {
   try {
      const searchParams = new URLSearchParams();

      if (filters?.page) searchParams.set('page', filters.page.toString());
      if (filters?.pageSize) searchParams.set('pageSize', filters.pageSize.toString());
      if (filters?.startDate) searchParams.set('startDate', filters.startDate.toString());
      if (filters?.endDate) searchParams.set('endDate', filters.endDate.toString());
      if (filters?.search) searchParams.set('search', filters.search.toString());
      if (filters?.role) searchParams.set('role', filters.role.toString());
      if (filters?.status) searchParams.set('status', filters.status.toString());

      const res = await api.get(GET_USERS, { searchParams }).json<UsersResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to get users'
      });
   }
};

// Ban user
export const toggleUserStatus = async (userId: string): Promise<ToggleUserStatus> => {
   try {
      const searchParams = new URLSearchParams();

      if (userId) searchParams.set('userId', userId);

      const res = await api.post(TOGGLE_USER_STATUS, { searchParams }).json<ToggleUserStatusResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to update user status'
      });
   }
};

export const signOutUser = async (userId: string): Promise<SignOutUser> => {
   try {
      const searchParams = new URLSearchParams();

      if (userId) searchParams.set('userId', userId);

      const res = await api.post(SIGN_OUT_USER, { searchParams }).json<SignOutUserResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to sign out user'
      });
   }
};

export const getUserDetails = async (userId: string): Promise<UserDetails> => {
   try {
      const searchParams = new URLSearchParams();

      if (userId) searchParams.set('userId', userId);

      const res = await api.get(GET_USER_DETAILS, { searchParams }).json<UserDetailsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to fetch user details'
      });
   }
};

export const exportUsersCsv = async (filters?: ExportUsersCsvFilter): Promise<ExportUsersCsv> => {
   try {
      const searchParams = new URLSearchParams();

      if (filters?.startDate) {
         searchParams.set('startDate', filters.startDate instanceof Date ? filters.startDate.toISOString() : String(filters.startDate));
      }
      if (filters?.endDate) {
         searchParams.set('endDate', filters.endDate instanceof Date ? filters.endDate.toISOString() : String(filters.endDate));
      }
      if (filters?.search) searchParams.set('search', filters.search);
      if (filters?.role) searchParams.set('role', filters.role);
      if (filters?.status) searchParams.set('status', filters.status);

      const res = await api.get(EXPORT_USERS_CSV, { searchParams }).json<ExportUsersCsvResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: 'Failed to export users to CSV',
      });
   }
};